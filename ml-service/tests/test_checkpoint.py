import pytest

from src.treinamento.checkpoint import (
    CAMPOS_OBRIGATORIOS_CHECKPOINT,
    ConfiguracaoCheckpoint,
    checkpoint_eh_pacote_producao,
    criar_checkpoint_producao,
    extrair_metadados_checkpoint,
    validar_checkpoint_producao,
)
from src.treinamento.contrato_treinamento import MetricasClassificacao
from src.treinamento.transforms import NormalizacaoImagem


def criar_state_dict_valido():
    return {
        "classifier.weight": [0.1, 0.2, 0.3],
        "classifier.bias": [0.0],
    }


def criar_labels_validos():
    return [
        {"codigo": "mel", "nome": "Melanoma"},
        {"codigo": "nv", "nome": "Nevo melanocítico"},
    ]


def criar_metricas_validas():
    return MetricasClassificacao(
        accuracy=0.72,
        macro_f1=0.70,
        auc_macro=0.95,
        recall_melanoma=0.80,
        precision_melanoma=0.35,
        recall_alto_risco=0.78,
        val_loss=0.42,
    )


def criar_checkpoint_valido():
    return criar_checkpoint_producao(
        state_dict=criar_state_dict_valido(),
        labels=criar_labels_validos(),
        metricas=criar_metricas_validas(),
    )


def test_criar_checkpoint_producao_padrao():
    checkpoint = criar_checkpoint_valido()

    assert checkpoint["arquitetura"] == "efficientnet_b3"
    assert checkpoint["image_size"] == 300
    assert checkpoint["criterio_selecao"] == "recall_melanoma"
    assert checkpoint["versao"] == "0.1.0"
    assert set(CAMPOS_OBRIGATORIOS_CHECKPOINT).issubset(checkpoint.keys())


def test_validar_checkpoint_producao_retorna_checkpoint():
    checkpoint = criar_checkpoint_valido()

    resultado = validar_checkpoint_producao(checkpoint)

    assert resultado["versao"] == "0.1.0"


def test_rejeita_state_dict_vazio():
    with pytest.raises(ValueError):
        criar_checkpoint_producao(
            state_dict={},
            labels=criar_labels_validos(),
            metricas=criar_metricas_validas(),
        )


def test_rejeita_labels_vazios():
    with pytest.raises(ValueError):
        criar_checkpoint_producao(
            state_dict=criar_state_dict_valido(),
            labels=[],
            metricas=criar_metricas_validas(),
        )


def test_rejeita_image_size_invalido():
    configuracao = ConfiguracaoCheckpoint(image_size=0)

    with pytest.raises(ValueError):
        criar_checkpoint_producao(
            state_dict=criar_state_dict_valido(),
            labels=criar_labels_validos(),
            metricas=criar_metricas_validas(),
            configuracao=configuracao,
        )


def test_rejeita_criterio_invalido():
    configuracao = ConfiguracaoCheckpoint(criterio_selecao="accuracy")

    with pytest.raises(ValueError):
        criar_checkpoint_producao(
            state_dict=criar_state_dict_valido(),
            labels=criar_labels_validos(),
            metricas=criar_metricas_validas(),
            configuracao=configuracao,
        )


def test_rejeita_normalizacao_invalida():
    configuracao = ConfiguracaoCheckpoint(
        normalizacao=NormalizacaoImagem(
            mean=(0.485, 0.456, 0.406),
            std=(0.229, 0.0, 0.225),
        )
    )

    with pytest.raises(ValueError):
        criar_checkpoint_producao(
            state_dict=criar_state_dict_valido(),
            labels=criar_labels_validos(),
            metricas=criar_metricas_validas(),
            configuracao=configuracao,
        )


def test_rejeita_metricas_invalidas():
    metricas = MetricasClassificacao(
        accuracy=1.2,
        macro_f1=0.70,
        auc_macro=0.95,
        recall_melanoma=0.80,
        precision_melanoma=0.35,
        recall_alto_risco=0.78,
    )

    with pytest.raises(ValueError):
        criar_checkpoint_producao(
            state_dict=criar_state_dict_valido(),
            labels=criar_labels_validos(),
            metricas=metricas,
        )


def test_extrair_metadados_remove_state_dict():
    checkpoint = criar_checkpoint_valido()

    metadados = extrair_metadados_checkpoint(checkpoint)

    assert "state_dict" not in metadados
    assert metadados["arquitetura"] == "efficientnet_b3"
    assert metadados["metricas"]["recall_melanoma"] == 0.80


def test_checkpoint_eh_pacote_producao():
    checkpoint = criar_checkpoint_valido()

    assert checkpoint_eh_pacote_producao(checkpoint) is True
    assert checkpoint_eh_pacote_producao({"state_dict": {}}) is False