import pytest

from src.treinamento.contrato_treinamento import MetricasClassificacao
from src.treinamento.loop_treino import (
    CRITERIO_PADRAO,
    EstadoLoopTreino,
    adicionar_resultado_historico,
    avancar_epoca_estado,
    atualizar_estado_loop,
    calcular_epocas_sem_melhoria,
    calcular_score_resultado,
    criar_historico_treinamento,
    criar_resultado_epoca,
    deve_interromper_por_paciencia,
    inicializar_estado_loop,
    obter_melhor_resultado_historico,
    resumir_historico_treinamento,
    selecionar_melhor_resultado,
    serializar_resultado_epoca,
)


def criar_metricas(
    recall_melanoma=0.80,
    macro_f1=0.70,
    auc_macro=0.95,
    val_loss=0.42,
):
    return MetricasClassificacao(
        accuracy=0.72,
        macro_f1=macro_f1,
        auc_macro=auc_macro,
        recall_melanoma=recall_melanoma,
        precision_melanoma=0.35,
        recall_alto_risco=0.78,
        val_loss=val_loss,
    )


def test_criterio_padrao():
    assert CRITERIO_PADRAO == "recall_melanoma"


def test_inicializar_estado_loop():
    estado = inicializar_estado_loop(total_epocas=5)

    assert estado.epoca_atual == 0
    assert estado.total_epocas == 5
    assert estado.criterio_selecao == "recall_melanoma"
    assert estado.interromper is False


def test_rejeita_total_epocas_invalido():
    with pytest.raises(ValueError):
        inicializar_estado_loop(total_epocas=0)


def test_criar_resultado_epoca():
    resultado = criar_resultado_epoca(
        epoca=1,
        metricas=criar_metricas(),
        perda_treino=0.50,
        perda_validacao=0.40,
        tempo_segundos=12.5,
        parametros={"learning_rate": 0.0001},
    )

    assert resultado.epoca == 1
    assert resultado.metricas.recall_melanoma == 0.80
    assert resultado.perda_validacao == 0.40
    assert resultado.parametros["learning_rate"] == 0.0001


def test_rejeita_epoca_invalida():
    with pytest.raises(ValueError):
        criar_resultado_epoca(
            epoca=0,
            metricas=criar_metricas(),
        )


def test_rejeita_perda_invalida():
    with pytest.raises(ValueError):
        criar_resultado_epoca(
            epoca=1,
            metricas=criar_metricas(),
            perda_validacao=-0.10,
        )


def test_calcular_score_resultado():
    resultado = criar_resultado_epoca(
        epoca=1,
        metricas=criar_metricas(recall_melanoma=0.82),
    )

    assert calcular_score_resultado(resultado) == 0.82


def test_serializar_resultado_epoca():
    resultado = criar_resultado_epoca(
        epoca=1,
        metricas=criar_metricas(),
        perda_validacao=0.40,
    )

    dados = serializar_resultado_epoca(resultado)

    assert dados["epoca"] == 1
    assert dados["metricas"]["recall_melanoma"] == 0.80
    assert dados["perda_validacao"] == 0.40


def test_criar_historico_treinamento_ordena_epocas():
    resultado_2 = criar_resultado_epoca(
        epoca=2,
        metricas=criar_metricas(),
    )

    resultado_1 = criar_resultado_epoca(
        epoca=1,
        metricas=criar_metricas(),
    )

    historico = criar_historico_treinamento([resultado_2, resultado_1])

    assert [resultado.epoca for resultado in historico.resultados] == [1, 2]


def test_rejeita_epocas_duplicadas():
    resultado_a = criar_resultado_epoca(
        epoca=1,
        metricas=criar_metricas(),
    )

    resultado_b = criar_resultado_epoca(
        epoca=1,
        metricas=criar_metricas(),
    )

    with pytest.raises(ValueError):
        criar_historico_treinamento([resultado_a, resultado_b])


def test_adicionar_resultado_historico():
    historico = criar_historico_treinamento()

    resultado = criar_resultado_epoca(
        epoca=1,
        metricas=criar_metricas(),
    )

    historico_atualizado = adicionar_resultado_historico(
        historico,
        resultado,
    )

    assert len(historico_atualizado.resultados) == 1
    assert historico_atualizado.resultados[0].epoca == 1


def test_selecionar_melhor_resultado_por_recall():
    resultado_1 = criar_resultado_epoca(
        epoca=1,
        metricas=criar_metricas(recall_melanoma=0.70),
    )

    resultado_2 = criar_resultado_epoca(
        epoca=2,
        metricas=criar_metricas(recall_melanoma=0.85),
    )

    melhor = selecionar_melhor_resultado([resultado_1, resultado_2])

    assert melhor.epoca == 2


def test_selecionar_melhor_resultado_por_desempate():
    resultado_1 = criar_resultado_epoca(
        epoca=1,
        metricas=criar_metricas(recall_melanoma=0.80, macro_f1=0.65),
    )

    resultado_2 = criar_resultado_epoca(
        epoca=2,
        metricas=criar_metricas(recall_melanoma=0.80, macro_f1=0.75),
    )

    melhor = selecionar_melhor_resultado([resultado_1, resultado_2])

    assert melhor.epoca == 2


def test_selecionar_melhor_resultado_por_menor_perda_validacao():
    resultado_1 = criar_resultado_epoca(
        epoca=1,
        metricas=criar_metricas(recall_melanoma=0.80, macro_f1=0.70),
        perda_validacao=0.50,
    )

    resultado_2 = criar_resultado_epoca(
        epoca=2,
        metricas=criar_metricas(recall_melanoma=0.80, macro_f1=0.70),
        perda_validacao=0.40,
    )

    melhor = selecionar_melhor_resultado([resultado_1, resultado_2])

    assert melhor.epoca == 2


def test_obter_melhor_resultado_historico():
    historico = criar_historico_treinamento(
        [
            criar_resultado_epoca(
                epoca=1,
                metricas=criar_metricas(recall_melanoma=0.70),
            ),
            criar_resultado_epoca(
                epoca=2,
                metricas=criar_metricas(recall_melanoma=0.85),
            ),
        ]
    )

    melhor = obter_melhor_resultado_historico(historico)

    assert melhor.epoca == 2


def test_calcular_epocas_sem_melhoria():
    historico = criar_historico_treinamento(
        [
            criar_resultado_epoca(
                epoca=1,
                metricas=criar_metricas(recall_melanoma=0.90),
            ),
            criar_resultado_epoca(
                epoca=2,
                metricas=criar_metricas(recall_melanoma=0.80),
            ),
            criar_resultado_epoca(
                epoca=3,
                metricas=criar_metricas(recall_melanoma=0.70),
            ),
        ]
    )

    assert calcular_epocas_sem_melhoria(historico) == 2


def test_deve_interromper_por_paciencia():
    historico = criar_historico_treinamento(
        [
            criar_resultado_epoca(
                epoca=1,
                metricas=criar_metricas(recall_melanoma=0.90),
            ),
            criar_resultado_epoca(
                epoca=2,
                metricas=criar_metricas(recall_melanoma=0.80),
            ),
            criar_resultado_epoca(
                epoca=3,
                metricas=criar_metricas(recall_melanoma=0.70),
            ),
        ]
    )

    assert deve_interromper_por_paciencia(historico, paciencia=2) is True
    assert deve_interromper_por_paciencia(historico, paciencia=3) is False


def test_atualizar_estado_loop():
    estado = inicializar_estado_loop(total_epocas=5)

    historico = criar_historico_treinamento(
        [
            criar_resultado_epoca(
                epoca=1,
                metricas=criar_metricas(recall_melanoma=0.90),
            ),
            criar_resultado_epoca(
                epoca=2,
                metricas=criar_metricas(recall_melanoma=0.80),
            ),
        ]
    )

    estado_atualizado = atualizar_estado_loop(
        estado=estado,
        historico=historico,
        paciencia=2,
    )

    assert estado_atualizado.epoca_atual == 2
    assert estado_atualizado.melhor_epoca == 1
    assert estado_atualizado.melhor_score == 0.90
    assert estado_atualizado.epocas_sem_melhoria == 1
    assert estado_atualizado.interromper is False


def test_atualizar_estado_loop_interrompe_ao_chegar_no_total():
    estado = inicializar_estado_loop(total_epocas=2)

    historico = criar_historico_treinamento(
        [
            criar_resultado_epoca(
                epoca=1,
                metricas=criar_metricas(recall_melanoma=0.70),
            ),
            criar_resultado_epoca(
                epoca=2,
                metricas=criar_metricas(recall_melanoma=0.80),
            ),
        ]
    )

    estado_atualizado = atualizar_estado_loop(
        estado=estado,
        historico=historico,
    )

    assert estado_atualizado.interromper is True


def test_avancar_epoca_estado():
    estado = EstadoLoopTreino(
        epoca_atual=1,
        total_epocas=2,
    )

    proximo_estado = avancar_epoca_estado(estado)
    estado_final = avancar_epoca_estado(proximo_estado)

    assert proximo_estado.epoca_atual == 2
    assert proximo_estado.interromper is False
    assert estado_final.epoca_atual == 2
    assert estado_final.interromper is True


def test_resumir_historico_treinamento():
    historico = criar_historico_treinamento(
        [
            criar_resultado_epoca(
                epoca=1,
                metricas=criar_metricas(recall_melanoma=0.70),
            ),
            criar_resultado_epoca(
                epoca=2,
                metricas=criar_metricas(recall_melanoma=0.85),
            ),
        ]
    )

    resumo = resumir_historico_treinamento(historico)

    assert resumo["total_epocas"] == 2
    assert resumo["melhor_epoca"] == 2
    assert resumo["melhor_score"] == 0.85
    assert resumo["resultados"][0]["epoca"] == 1
