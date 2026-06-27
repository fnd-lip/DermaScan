from dataclasses import dataclass, field
from typing import Any


MEAN_IMAGENET = (0.485, 0.456, 0.406)
STD_IMAGENET = (0.229, 0.224, 0.225)

MODOS_VALIDOS = {
    "treino",
    "validacao",
    "inferencia",
}


@dataclass(frozen=True)
class NormalizacaoImagem:
    mean: tuple[float, float, float] = MEAN_IMAGENET
    std: tuple[float, float, float] = STD_IMAGENET

    def para_dict(self) -> dict[str, list[float]]:
        return {
            "mean": list(self.mean),
            "std": list(self.std),
        }


@dataclass(frozen=True)
class ConfiguracaoPreprocessamento:
    image_size: int = 300
    modo: str = "treino"
    normalizacao: NormalizacaoImagem = field(default_factory=NormalizacaoImagem)


def validar_normalizacao(normalizacao: NormalizacaoImagem) -> NormalizacaoImagem:
    if len(normalizacao.mean) != 3:
        raise ValueError("mean deve conter 3 valores.")

    if len(normalizacao.std) != 3:
        raise ValueError("std deve conter 3 valores.")

    for valor in normalizacao.std:
        if valor <= 0:
            raise ValueError("Todos os valores de std devem ser maiores que zero.")

    return normalizacao


def validar_configuracao_preprocessamento(
    configuracao: ConfiguracaoPreprocessamento,
) -> ConfiguracaoPreprocessamento:
    if configuracao.image_size <= 0:
        raise ValueError("image_size deve ser maior que zero.")

    if configuracao.modo not in MODOS_VALIDOS:
        raise ValueError("modo inválido.")

    validar_normalizacao(configuracao.normalizacao)

    return configuracao


def criar_configuracao_preprocessamento(
    image_size: int = 300,
    modo: str = "treino",
) -> ConfiguracaoPreprocessamento:
    configuracao = ConfiguracaoPreprocessamento(
        image_size=image_size,
        modo=modo,
    )

    return validar_configuracao_preprocessamento(configuracao)


def serializar_configuracao_preprocessamento(
    configuracao: ConfiguracaoPreprocessamento,
) -> dict[str, Any]:
    configuracao_validada = validar_configuracao_preprocessamento(configuracao)

    return {
        "image_size": configuracao_validada.image_size,
        "modo": configuracao_validada.modo,
        "normalizacao": configuracao_validada.normalizacao.para_dict(),
    }


def criar_transformacao_torchvision(
    configuracao: ConfiguracaoPreprocessamento,
    usar_augmentacao: bool = False,
) -> Any:
    configuracao_validada = validar_configuracao_preprocessamento(configuracao)

    try:
        from torchvision import transforms
    except ModuleNotFoundError as erro:
        raise RuntimeError(
            "torchvision não está instalado neste ambiente."
        ) from erro

    operacoes = [
        transforms.Resize(
            (
                configuracao_validada.image_size,
                configuracao_validada.image_size,
            )
        ),
    ]

    if usar_augmentacao and configuracao_validada.modo == "treino":
        operacoes.append(transforms.RandomHorizontalFlip(p=0.5))

    operacoes.extend(
        [
            transforms.ToTensor(),
            transforms.Normalize(
                mean=configuracao_validada.normalizacao.mean,
                std=configuracao_validada.normalizacao.std,
            ),
        ]
    )

    return transforms.Compose(operacoes)