import pytest

from src.treinamento.avaliacao import (
    CRITERIO_PADRAO,
    criar_metricas_classificacao,
    criar_resultado_avaliacao,
    normalizar_metricas_avaliacao,
    resolver_nome_metrica,
    resumir_resultado_avaliacao,
    selecionar_melhor_resultado,
)


def metricas_base(**sobrescritas):
    metricas = {
        "acc": 0.72,
        "f1_macro": 0.70,
        "macro_auc": 0.95,
        "recall_mel": 0.80,
        "precision_mel": 0.35,
        "high_risk_recall": 0.78,
        "loss_val": 0.42,
    }

    metricas.update(sobrescritas)

    return metricas


def test_criterio_padrao():
    assert CRITERIO_PADRAO == "recall_melanoma"


def test_resolver_nome_metrica():
    assert resolver_nome_metrica(" F1-Macro ") == "macro_f1"
    assert resolver_nome_metrica("recall mel") == "recall_melanoma"


def test_normalizar_metricas_avaliacao():
    metricas = normalizar_metricas_avaliacao(metricas_base())

    assert metricas["accuracy"] == 0.72
    assert metricas["macro_f1"] == 0.70
    assert metricas["auc_macro"] == 0.95
    assert metricas["recall_melanoma"] == 0.80


def test_rejeita_metrica_nao_suportada():
    with pytest.raises(ValueError):
        normalizar_metricas_avaliacao(
            {
                "accuracy": 0.72,
                "outra_metrica": 0.10,
            }
        )


def test_criar_metricas_classificacao():
    metricas = criar_metricas_classificacao(metricas_base())

    assert metricas.accuracy == 0.72
    assert metricas.macro_f1 == 0.70
    assert metricas.recall_melanoma == 0.80


def test_rejeita_metricas_incompletas():
    with pytest.raises(ValueError):
        criar_metricas_classificacao(
            {
                "accuracy": 0.72,
            }
        )


def test_criar_resultado_avaliacao():
    resultado = criar_resultado_avaliacao(
        identificador_modelo="modelo-a",
        metricas=metricas_base(),
        parametros={"epochs": 10},
    )

    assert resultado.identificador_modelo == "modelo-a"
    assert resultado.metricas.recall_melanoma == 0.80
    assert resultado.parametros["epochs"] == 10


def test_selecionar_melhor_resultado_por_recall_melanoma():
    resultado_a = criar_resultado_avaliacao(
        identificador_modelo="modelo-a",
        metricas=metricas_base(recall_mel=0.70),
    )

    resultado_b = criar_resultado_avaliacao(
        identificador_modelo="modelo-b",
        metricas=metricas_base(recall_mel=0.85),
    )

    melhor = selecionar_melhor_resultado([resultado_a, resultado_b])

    assert melhor.identificador_modelo == "modelo-b"


def test_selecionar_melhor_resultado_por_desempate():
    resultado_a = criar_resultado_avaliacao(
        identificador_modelo="modelo-a",
        metricas=metricas_base(recall_mel=0.80, f1_macro=0.65),
    )

    resultado_b = criar_resultado_avaliacao(
        identificador_modelo="modelo-b",
        metricas=metricas_base(recall_mel=0.80, f1_macro=0.75),
    )

    melhor = selecionar_melhor_resultado([resultado_a, resultado_b])

    assert melhor.identificador_modelo == "modelo-b"


def test_selecionar_melhor_resultado_rejeita_lista_vazia():
    with pytest.raises(ValueError):
        selecionar_melhor_resultado([])


def test_resumir_resultado_avaliacao():
    resultado = criar_resultado_avaliacao(
        identificador_modelo="modelo-a",
        metricas=metricas_base(),
    )

    resumo = resumir_resultado_avaliacao(resultado)

    assert resumo["identificador_modelo"] == "modelo-a"
    assert resumo["score"] == 0.80
    assert resumo["score_desempate"] == 0.70
    assert resumo["metricas"]["recall_melanoma"] == 0.80
