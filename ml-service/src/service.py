import base64
import io
import json
from pathlib import Path

import bentoml
import numpy as np
import timm
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

tamanho_imagem = 224

pasta_base = Path(__file__).resolve().parent.parent
caminho_modelo = pasta_base / "models" / "modelo_dermascan.pth"
caminho_labels = pasta_base / "src" / "labels.json"

transformacao_imagem = transforms.Compose(
    [
        transforms.Resize((tamanho_imagem, tamanho_imagem)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225],
        ),
    ],
)


def carregar_labels():
    with open(caminho_labels, "r", encoding="utf-8") as arquivo:
        return json.load(arquivo)


def carregar_modelo(checkpoint, quantidade_classes):
    arquitetura = checkpoint.get("arquitetura", "efficientnet_b3")

    modelo = timm.create_model(
        arquitetura,
        pretrained=False,
        num_classes=quantidade_classes,
    )

    modelo.load_state_dict(checkpoint["state_dict"])
    modelo.eval()

    return modelo, arquitetura


def converter_base64_para_imagem(imagem_base64: str):
    if "," in imagem_base64:
        imagem_base64 = imagem_base64.split(",", 1)[1]

    bytes_imagem = base64.b64decode(imagem_base64)
    imagem = Image.open(io.BytesIO(bytes_imagem)).convert("RGB")

    return imagem


def preparar_imagem(imagem: Image.Image):
    tensor = transformacao_imagem(imagem)
    tensor = tensor.unsqueeze(0)

    return tensor


@bentoml.service(
    resources={"cpu": "2"},
    traffic={"timeout": 60},
)
class DermaScanService:
    def __init__(self):
        self.dispositivo = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.labels = carregar_labels()

        checkpoint = torch.load(
            caminho_modelo,
            map_location=self.dispositivo,
        )

        self.modelo, self.arquitetura = carregar_modelo(
            checkpoint=checkpoint,
            quantidade_classes=len(self.labels),
        )

        self.modelo.to(self.dispositivo)
        self.modelo.eval()

    @bentoml.api(route="/health")
    def health(self) -> dict:
        return {
            "status": "ok",
            "mensagem": "ML service DermaScan rodando",
            "modelo": self.arquitetura,
            "framework": "PyTorch",
        }

    @bentoml.api(route="/predict")
    def predict(self, imageBase64: str) -> dict:
        imagem = converter_base64_para_imagem(imageBase64)
        imagem_tensor = preparar_imagem(imagem).to(self.dispositivo)

        with torch.no_grad():
            saida = self.modelo(imagem_tensor)
            probabilidades_tensor = F.softmax(saida, dim=1)[0]

        indice_principal = int(torch.argmax(probabilidades_tensor).item())
        label_principal = self.labels[indice_principal]

        probabilidades = []

        for indice, probabilidade in enumerate(probabilidades_tensor):
            label = self.labels[indice]

            probabilidades.append(
                {
                    "classe": label["nome"],
                    "codigo": label["codigo"],
                    "probabilidade": float(probabilidade.item()),
                }
            )

        probabilidades = sorted(
            probabilidades,
            key=lambda item: item["probabilidade"],
            reverse=True,
        )

        return {
            "classePrevista": label_principal["nome"],
            "codigo": label_principal["codigo"],
            "confianca": float(probabilidades_tensor[indice_principal].item()),
            "nivelAtencao": label_principal["nivelAtencao"],
            "probabilidades": probabilidades,
            "fonte": f"{self.arquitetura} PyTorch BentoML",
        }