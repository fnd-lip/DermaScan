import pytest

from src.treinamento.contrato_treinamento import (
    ConfiguracaoTreinamento,
    MetricasClassificacao,
    calcular_score_selecao,
    gerar_resumo_experimento,
    validar_configuracao_treinamento,
    validar_metricas_classificacao,
)


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


def test_configuracao_padrao_e_valida():
    configuracao = ConfiguracaoTreinamento()

    resultado = validar_configuracao_treinamento(configuracao)

    assert resultado.arquitetura == "efficientnet_b3"
    assert resultado.image_size == 300
    assert resultado.criterio_selecao == "recall_melanoma"


def test_configuracao_invalida_rejeita_image_size():
    configuracao = ConfiguracaoTreinamento(image_size=0)

    with pytest.raises(ValueError):
        validar_configuracao_treinamento(configuracao)


def test_metricas_validas():
    metricas = criar_metricas_validas()

    resultado = validar_metricas_classificacao(metricas)

    assert resultado.recall_melanoma == 0.80


def test_metricas_invalidas_rejeitam_valor_maior_que_um():
    metricas = MetricasClassificacao(
        accuracy=1.20,
        macro_f1=0.70,
        auc_macro=0.95,
        recall_melanoma=0.80,
        precision_melanoma=0.35,
        recall_alto_risco=0.78,
    )

    with pytest.raises(ValueError):
        validar_metricas_classificacao(metricas)


def test_score_modelo_por_criterio():
    metricas = criar_metricas_validas()

    score = calcular_score_selecao(
        metricas=metricas,
        criterio="recall_melanoma",
    )

    assert score == 0.80


def test_score_modelo_rejeita_criterio_invalido():
    metricas = criar_metricas_validas()

    with pytest.raises(ValueError):
        calcular_score_selecao(
            metricas=metricas,
            criterio="accuracy",
        )


def test_resumo_experimento_exporta_dict():
    configuracao = ConfiguracaoTreinamento()
    metricas = criar_metricas_validas()

    resumo = gerar_resumo_experimento(
        configuracao=configuracao,
        metricas=metricas,
    )

    assert resumo["configuracao"]["arquitetura"] == "efficientnet_b3"
    assert resumo["metricas"]["recall_melanoma"] == 0.80
    assert resumo["criterio_selecao"] == "recall_melanoma"
    assert resumo["score_selecao"] == 0.80