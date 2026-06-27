from dataclasses import asdict, dataclass
from importlib import import_module
from typing import Any

ARQUITETURA_PADRAO = "efficientnet_b3"
ARQUITETURAS_SUPORTADAS = {
    "efficientnet_b3",
}


@dataclass(frozen=True)
class ConfiguracaoModelo:
    arquitetura: str = ARQUITETURA_PADRAO
    quantidade_classes: int = 7
    pretrained: bool = False


def normalizar_nome_arquitetura(arquitetura: str) -> str:
    return arquitetura.strip().lower()


def validar_configuracao_modelo(
    configuracao: ConfiguracaoModelo,
) -> ConfiguracaoModelo:
    arquitetura = normalizar_nome_arquitetura(configuracao.arquitetura)

    if not arquitetura:
        raise ValueError("arquitetura inválida.")

    if arquitetura not in ARQUITETURAS_SUPORTADAS:
        raise ValueError("arquitetura não suportada.")

    if configuracao.quantidade_classes <= 0:
        raise ValueError("quantidade_classes inválida.")

    return ConfiguracaoModelo(
        arquitetura=arquitetura,
        quantidade_classes=configuracao.quantidade_classes,
        pretrained=configuracao.pretrained,
    )


def criar_configuracao_modelo(
    arquitetura: str = ARQUITETURA_PADRAO,
    quantidade_classes: int = 7,
    pretrained: bool = False,
) -> ConfiguracaoModelo:
    configuracao = ConfiguracaoModelo(
        arquitetura=arquitetura,
        quantidade_classes=quantidade_classes,
        pretrained=pretrained,
    )

    return validar_configuracao_modelo(configuracao)


def serializar_configuracao_modelo(
    configuracao: ConfiguracaoModelo,
) -> dict[str, Any]:
    configuracao_validada = validar_configuracao_modelo(configuracao)

    return asdict(configuracao_validada)


def carregar_timm() -> Any:
    try:
        return import_module("timm")
    except ModuleNotFoundError as erro:
        raise RuntimeError("Dependência timm não disponível.") from erro


def criar_modelo_timm(configuracao: ConfiguracaoModelo) -> Any:
    configuracao_validada = validar_configuracao_modelo(configuracao)
    timm = carregar_timm()

    return timm.create_model(
        configuracao_validada.arquitetura,
        pretrained=configuracao_validada.pretrained,
        num_classes=configuracao_validada.quantidade_classes,
    )
