import pytest

from src.treinamento.transforms import (
    MEAN_IMAGENET,
    STD_IMAGENET,
    ConfiguracaoPreprocessamento,
    NormalizacaoImagem,
    criar_configuracao_preprocessamento,
    serializar_configuracao_preprocessamento,
    validar_configuracao_preprocessamento,
    validar_normalizacao,
)


def test_configuracao_padrao():
    configuracao = criar_configuracao_preprocessamento()

    assert configuracao.image_size == 300
    assert configuracao.modo == "treino"
    assert configuracao.normalizacao.mean == MEAN_IMAGENET
    assert configuracao.normalizacao.std == STD_IMAGENET


def test_configuracao_para_inferencia():
    configuracao = criar_configuracao_preprocessamento(
        image_size=224,
        modo="inferencia",
    )

    assert configuracao.image_size == 224
    assert configuracao.modo == "inferencia"


def test_rejeita_image_size_invalido():
    configuracao = ConfiguracaoPreprocessamento(image_size=0)

    with pytest.raises(ValueError):
        validar_configuracao_preprocessamento(configuracao)


def test_rejeita_modo_invalido():
    configuracao = ConfiguracaoPreprocessamento(modo="teste")

    with pytest.raises(ValueError):
        validar_configuracao_preprocessamento(configuracao)


def test_normalizacao_padrao():
    normalizacao = NormalizacaoImagem()

    assert normalizacao.mean == (0.485, 0.456, 0.406)
    assert normalizacao.std == (0.229, 0.224, 0.225)


def test_rejeita_mean_incompleto():
    normalizacao = NormalizacaoImagem(
        mean=(0.485, 0.456),
        std=STD_IMAGENET,
    )

    with pytest.raises(ValueError):
        validar_normalizacao(normalizacao)


def test_rejeita_std_zero():
    normalizacao = NormalizacaoImagem(
        mean=MEAN_IMAGENET,
        std=(0.229, 0.0, 0.225),
    )

    with pytest.raises(ValueError):
        validar_normalizacao(normalizacao)


def test_serializar_configuracao():
    configuracao = ConfiguracaoPreprocessamento(
        image_size=300,
        modo="validacao",
    )

    resultado = serializar_configuracao_preprocessamento(configuracao)

    assert resultado == {
        "image_size": 300,
        "modo": "validacao",
        "normalizacao": {
            "mean": [0.485, 0.456, 0.406],
            "std": [0.229, 0.224, 0.225],
        },
    }