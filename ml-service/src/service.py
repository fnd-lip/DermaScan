import json
from pathlib import Path

import bentoml
import torch

from src.image_utils import (
    converter_base64_para_imagem,
)
from src.model_runtime import (
    DermaScanPredictor,
)

PASTA_BASE = Path(__file__).resolve().parent.parent

CAMINHO_MODELO = PASTA_BASE / "models" / "modelo_dermascan.pth"

CAMINHO_LABELS = PASTA_BASE / "src" / "labels.json"


def carregar_labels() -> dict:
    with CAMINHO_LABELS.open(
        "r",
        encoding="utf-8",
    ) as arquivo:
        labels = json.load(arquivo)

    return {label["codigo"]: label for label in labels}


@bentoml.service(
    resources={"cpu": "2"},
    traffic={"timeout": 60},
)
class DermaScanService:
    def __init__(self):
        self.labels = carregar_labels()

        self.preditor = DermaScanPredictor(CAMINHO_MODELO)

    @bentoml.api(route="/health")
    def health(self) -> dict:
        return {
            "status": "ok",
            "mensagem": ("ML service DermaScan rodando"),
            "modelo": (self.preditor.arquitetura),
            "tamanhoImagem": (self.preditor.tamanho_imagem),
            "quantidadeClasses": (self.preditor.quantidade_classes),
            "tta": self.preditor.usar_tta,
            "dispositivo": str(self.preditor.dispositivo),
            "framework": "PyTorch",
        }

    @bentoml.api(route="/predict")
    def predict(
        self,
        imageBase64: str,
    ) -> dict:
        imagem = converter_base64_para_imagem(imageBase64)

        resultado = self.preditor.prever(imagem)

        probabilidades = resultado["probabilidades"]

        ranking = []

        for indice, codigo in enumerate(self.preditor.codigos):
            label = self.labels[codigo]

            probabilidade = float(probabilidades[indice])

            ranking.append(
                {
                    "classe": (self.preditor.nomes[codigo]),
                    "codigo": codigo,
                    "probabilidade": (probabilidade),
                    "probabilidadePercentual": (
                        round(
                            probabilidade * 100,
                            2,
                        )
                    ),
                    "nivelAtencao": (label["nivelAtencao"]),
                    "alerta": (
                        resultado["alertas"].get(
                            codigo,
                            False,
                        )
                    ),
                }
            )

        ranking.sort(
            key=lambda item: (item["probabilidade"]),
            reverse=True,
        )

        codigo = resultado["codigo"]
        label = self.labels[codigo]

        confianca = float(probabilidades[resultado["indice"]])

        return {
            "classePrevista": (self.preditor.nomes[codigo]),
            "codigo": codigo,
            "confianca": confianca,
            "confiancaPercentual": round(
                confianca * 100,
                2,
            ),
            "nivelAtencao": (label["nivelAtencao"]),
            "alertaAtencao": any(resultado["alertas"].values()),
            "alertas": resultado["alertas"],
            "probabilidades": ranking,
            "fonte": (f"{self.preditor.arquitetura} " "PyTorch BentoML"),
        }
