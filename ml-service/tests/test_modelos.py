import pytest

from src.treinamento.modelos import (
    ARQUITETURA_PADRAO,
    ARQUITETURAS_SUPORTADAS,
    ConfiguracaoModelo,
    criar_configuracao_modelo,
    normalizar_nome_arquitetura,
    serializar_configuracao_modelo,
    validar_configuracao_modelo,
)


def test_arquitetura_padrao():
    assert ARQUITETURA_PADRAO == "efficientnet_b3"
    assert "efficientnet_b3" in ARQUITETURAS_SUPORTADAS


def test_normalizar_nome_arquitetura():
    assert normalizar_nome_arquitetura(" EfficientNet_B3 ") == "efficientnet_b3"


def test_criar_configuracao_modelo_padrao():
    configuracao = criar_configuracao_modelo()

    assert configuracao.arquitetura == "efficientnet_b3"
    assert configuracao.quantidade_classes == 7
    assert configuracao.pretrained is False


def test_criar_configuracao_modelo_customizada():
    configuracao = criar_configuracao_modelo(
        arquitetura=" EfficientNet_B3 ",
        quantidade_classes=3,
        pretrained=False,
    )

    assert configuracao.arquitetura == "efficientnet_b3"
    assert configuracao.quantidade_classes == 3
    assert configuracao.pretrained is False


def test_rejeita_arquitetura_vazia():
    configuracao = ConfiguracaoModelo(arquitetura=" ")

    with pytest.raises(ValueError):
        validar_configuracao_modelo(configuracao)


def test_rejeita_arquitetura_nao_suportada():
    configuracao = ConfiguracaoModelo(arquitetura="resnet50")

    with pytest.raises(ValueError):
        validar_configuracao_modelo(configuracao)


def test_rejeita_quantidade_classes_invalida():
    configuracao = ConfiguracaoModelo(quantidade_classes=0)

    with pytest.raises(ValueError):
        validar_configuracao_modelo(configuracao)


def test_serializar_configuracao_modelo():
    configuracao = ConfiguracaoModelo(
        arquitetura="efficientnet_b3",
        quantidade_classes=7,
        pretrained=False,
    )

    resultado = serializar_configuracao_modelo(configuracao)

    assert resultado == {
        "arquitetura": "efficientnet_b3",
        "quantidade_classes": 7,
        "pretrained": False,
    }