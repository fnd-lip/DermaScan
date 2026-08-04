from pathlib import Path

import numpy as np
import timm
import torch
from PIL import Image
from torchvision import transforms


class DermaScanPredictor:
    def __init__(
        self,
        caminho_modelo: Path,
    ):
        self.dispositivo = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        self.checkpoint = self._carregar_checkpoint(caminho_modelo)

        self.arquitetura = str(self.checkpoint["architecture"])

        self.quantidade_classes = int(self.checkpoint["num_classes"])

        self.tamanho_imagem = int(self.checkpoint["image_size"])

        self.codigos = list(self.checkpoint["class_codes"])

        self.nomes = self._normalizar_nomes(self.checkpoint["class_names_pt"])

        self.limiares = {
            codigo: float(limiar)
            for codigo, limiar in self.checkpoint.get(
                "alert_thresholds",
                {},
            ).items()
        }

        configuracao = self.checkpoint.get(
            "training_config",
            {},
        )

        self.usar_tta = bool(
            configuracao.get(
                "final_tta",
                False,
            )
        )

        self.transformacao = self._criar_transformacao()

        self.modelo = timm.create_model(
            self.arquitetura,
            pretrained=False,
            num_classes=self.quantidade_classes,
            drop_rate=0.0,
            drop_path_rate=0.0,
        )

        self.modelo.load_state_dict(
            self.checkpoint["state_dict"],
            strict=True,
        )

        self.modelo.to(self.dispositivo).eval()

    @staticmethod
    def _carregar_checkpoint(
        caminho: Path,
    ) -> dict:
        if not caminho.is_file():
            raise FileNotFoundError(f"Modelo não encontrado: {caminho}")

        try:
            return torch.load(
                caminho,
                map_location="cpu",
                weights_only=False,
            )
        except TypeError:
            return torch.load(
                caminho,
                map_location="cpu",
            )

    def _normalizar_nomes(
        self,
        nomes,
    ) -> dict:
        if isinstance(nomes, dict):
            return nomes

        return dict(
            zip(
                self.codigos,
                nomes,
            )
        )

    def _criar_transformacao(self):
        normalizacao = self.checkpoint["normalization"]

        return transforms.Compose(
            [
                transforms.Resize(
                    (
                        self.tamanho_imagem,
                        self.tamanho_imagem,
                    ),
                    antialias=True,
                ),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=normalizacao["mean"],
                    std=normalizacao["std"],
                ),
            ]
        )

    def _executar_modelo(
        self,
        tensor: torch.Tensor,
    ) -> torch.Tensor:
        visualizacoes = [tensor]

        if self.usar_tta:
            visualizacoes.extend(
                [
                    torch.flip(tensor, [3]),
                    torch.flip(tensor, [2]),
                    torch.flip(tensor, [2, 3]),
                ]
            )

        with torch.inference_mode():
            saidas = [self.modelo(visualizacao) for visualizacao in visualizacoes]

        return torch.stack(saidas).mean(dim=0)

    def _calibrar(
        self,
        logits: torch.Tensor,
    ) -> np.ndarray:
        calibracao = self.checkpoint.get("calibration")

        if not calibracao:
            return torch.softmax(logits, dim=1).cpu().numpy()

        if calibracao.get("method") != "multinomial_logit":
            raise ValueError("Método de calibração incompatível.")

        valores = logits.cpu().numpy().astype(np.float64)

        coeficientes = np.asarray(
            calibracao["coef"],
            dtype=np.float64,
        )

        intercepto = np.asarray(
            calibracao["intercept"],
            dtype=np.float64,
        )

        scores = valores @ coeficientes.T + intercepto

        scores -= scores.max(
            axis=1,
            keepdims=True,
        )

        probabilidades = np.exp(scores)

        return probabilidades / (
            probabilidades.sum(
                axis=1,
                keepdims=True,
            )
        )

    def prever(
        self,
        imagem: Image.Image,
    ) -> dict:
        tensor = self.transformacao(imagem).unsqueeze(0).to(self.dispositivo)

        logits = self._executar_modelo(tensor)

        probabilidades = self._calibrar(logits)[0]

        indice = int(probabilidades.argmax())

        alertas = {
            codigo: bool(probabilidades[self.codigos.index(codigo)] >= limiar)
            for codigo, limiar in self.limiares.items()
            if codigo in self.codigos
        }

        return {
            "indice": indice,
            "codigo": self.codigos[indice],
            "probabilidades": probabilidades,
            "alertas": alertas,
        }
