from pathlib import Path
from typing import Any

import numpy as np
import timm
import torch
from PIL import Image
from torchvision import transforms


class DermaScanPredictor:
    CAMPOS_OBRIGATORIOS = {
        "state_dict",
        "architecture",
        "num_classes",
        "image_size",
        "class_codes",
        "class_names_pt",
        "normalization",
    }

    def __init__(
        self,
        caminho_modelo: Path,
    ):
        self.dispositivo = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        self.checkpoint = self._carregar_checkpoint(caminho_modelo)

        self.arquitetura = str(self.checkpoint["architecture"])

        self.quantidade_classes = int(self.checkpoint["num_classes"])

        self.tamanho_imagem = int(self.checkpoint["image_size"])

        self.codigos = [str(codigo) for codigo in self.checkpoint["class_codes"]]

        if len(self.codigos) != self.quantidade_classes:
            raise ValueError(
                "A quantidade de códigos das classes não corresponde "
                "ao número de classes do modelo."
            )

        self.nomes = self._normalizar_nomes(self.checkpoint["class_names_pt"])

        self.limiares = {
            str(codigo): float(limiar)
            for codigo, limiar in self.checkpoint.get(
                "alert_thresholds",
                {},
            ).items()
            if str(codigo) in self.codigos
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

        self.modelo.to(self.dispositivo)
        self.modelo.eval()

    @classmethod
    def _carregar_checkpoint(
        cls,
        caminho: Path,
    ) -> dict[str, Any]:
        caminho_resolvido = caminho.expanduser().resolve()

        if not caminho_resolvido.is_file():
            raise FileNotFoundError(f"Modelo não encontrado: {caminho_resolvido}")

        checkpoint = torch.load(
            caminho_resolvido,
            map_location="cpu",
            weights_only=True,
        )

        if not isinstance(checkpoint, dict):
            raise ValueError("Checkpoint inválido: era esperado um dicionário.")

        campos_ausentes = cls.CAMPOS_OBRIGATORIOS.difference(checkpoint)

        if campos_ausentes:
            campos_formatados = ", ".join(sorted(campos_ausentes))

            raise ValueError(
                "Checkpoint incompleto. Campos ausentes: " f"{campos_formatados}"
            )

        state_dict = checkpoint["state_dict"]

        if not isinstance(state_dict, dict):
            raise ValueError("Checkpoint inválido: state_dict deve ser um dicionário.")

        return checkpoint

    def _normalizar_nomes(
        self,
        nomes: Any,
    ) -> dict[str, str]:
        if isinstance(nomes, dict):
            nomes_normalizados = {
                str(codigo): str(nome) for codigo, nome in nomes.items()
            }
        else:
            nomes_normalizados = {
                codigo: str(nome)
                for codigo, nome in zip(
                    self.codigos,
                    nomes,
                    strict=True,
                )
            }

        codigos_sem_nome = [
            codigo for codigo in self.codigos if codigo not in nomes_normalizados
        ]

        if codigos_sem_nome:
            raise ValueError(
                "Nomes ausentes para as classes: " + ", ".join(codigos_sem_nome)
            )

        return nomes_normalizados

    def _criar_transformacao(
        self,
    ) -> transforms.Compose:
        normalizacao = self.checkpoint["normalization"]

        if not isinstance(normalizacao, dict):
            raise ValueError("Configuração de normalização inválida.")

        if "mean" not in normalizacao or "std" not in normalizacao:
            raise ValueError("Configuração de normalização incompleta.")

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
                    torch.flip(tensor, dims=[3]),
                    torch.flip(tensor, dims=[2]),
                    torch.flip(tensor, dims=[2, 3]),
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
            return (
                torch.softmax(
                    logits.float(),
                    dim=1,
                )
                .cpu()
                .numpy()
            )

        if not isinstance(calibracao, dict):
            raise ValueError("Configuração de calibração inválida.")

        if calibracao.get("method") != "multinomial_logit":
            raise ValueError("Método de calibração incompatível.")

        if "coef" not in calibracao or "intercept" not in calibracao:
            raise ValueError("Configuração de calibração incompleta.")

        valores = logits.float().cpu().numpy().astype(np.float64)

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

        somas = probabilidades.sum(
            axis=1,
            keepdims=True,
        )

        if not np.isfinite(somas).all() or np.any(somas <= 0):
            raise RuntimeError("A calibração produziu valores inválidos.")

        return probabilidades / somas

    def prever(
        self,
        imagem: Image.Image,
    ) -> dict[str, Any]:
        tensor = self.transformacao(imagem).unsqueeze(0).to(self.dispositivo)

        logits = self._executar_modelo(tensor)

        probabilidades = self._calibrar(logits)[0]

        if not np.isfinite(probabilidades).all():
            raise RuntimeError("A inferência produziu probabilidades inválidas.")

        if not np.isclose(
            probabilidades.sum(),
            1.0,
            atol=1e-6,
        ):
            raise RuntimeError("As probabilidades geradas não somam 1.")

        indice = int(probabilidades.argmax())

        alertas = {
            codigo: bool(probabilidades[self.codigos.index(codigo)] >= limiar)
            for codigo, limiar in self.limiares.items()
        }

        return {
            "indice": indice,
            "codigo": self.codigos[indice],
            "probabilidades": probabilidades,
            "alertas": alertas,
        }
