from collections.abc import Sequence
from dataclasses import asdict, dataclass, field
from typing import Any

from src.treinamento.contrato_treinamento import (
    CRITERIOS_SUPORTADOS,
    MetricasClassificacao,
    calcular_score_selecao,
    validar_metricas_classificacao,
)

CRITERIO_PADRAO = "recall_melanoma"
CRITERIO_DESEMPATE_PADRAO = "macro_f1"


@dataclass(frozen=True)
class ResultadoEpoca:
    epoca: int
    metricas: MetricasClassificacao
    perda_treino: float | None = None
    perda_validacao: float | None = None
    tempo_segundos: float | None = None
    parametros: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class HistoricoTreinamento:
    resultados: list[ResultadoEpoca] = field(default_factory=list)
    criterio_selecao: str = CRITERIO_PADRAO
    criterio_desempate: str = CRITERIO_DESEMPATE_PADRAO


@dataclass(frozen=True)
class EstadoLoopTreino:
    epoca_atual: int = 0
    total_epocas: int = 1
    criterio_selecao: str = CRITERIO_PADRAO
    melhor_epoca: int | None = None
    melhor_score: float | None = None
    epocas_sem_melhoria: int = 0
    interromper: bool = False


def validar_criterio_loop(criterio: str) -> str:
    criterio_normalizado = criterio.strip()

    if criterio_normalizado not in CRITERIOS_SUPORTADOS:
        raise ValueError("critério inválido.")

    return criterio_normalizado


def validar_numero_nao_negativo(
    valor: float | None,
    nome: str,
) -> float | None:
    if valor is None:
        return None

    try:
        numero = float(valor)
    except (TypeError, ValueError) as erro:
        raise ValueError(f"{nome} inválido.") from erro

    if numero < 0:
        raise ValueError(f"{nome} inválido.")

    return numero


def validar_resultado_epoca(
    resultado: ResultadoEpoca,
) -> ResultadoEpoca:
    if not isinstance(resultado, ResultadoEpoca):
        raise ValueError("resultado inválido.")

    if resultado.epoca <= 0:
        raise ValueError("epoca inválida.")

    metricas = validar_metricas_classificacao(resultado.metricas)

    perda_treino = validar_numero_nao_negativo(
        resultado.perda_treino,
        "perda_treino",
    )

    perda_validacao = validar_numero_nao_negativo(
        resultado.perda_validacao,
        "perda_validacao",
    )

    tempo_segundos = validar_numero_nao_negativo(
        resultado.tempo_segundos,
        "tempo_segundos",
    )

    return ResultadoEpoca(
        epoca=int(resultado.epoca),
        metricas=metricas,
        perda_treino=perda_treino,
        perda_validacao=perda_validacao,
        tempo_segundos=tempo_segundos,
        parametros=dict(resultado.parametros),
    )


def criar_resultado_epoca(
    epoca: int,
    metricas: MetricasClassificacao,
    perda_treino: float | None = None,
    perda_validacao: float | None = None,
    tempo_segundos: float | None = None,
    parametros: dict[str, Any] | None = None,
) -> ResultadoEpoca:
    resultado = ResultadoEpoca(
        epoca=epoca,
        metricas=metricas,
        perda_treino=perda_treino,
        perda_validacao=perda_validacao,
        tempo_segundos=tempo_segundos,
        parametros=dict(parametros or {}),
    )

    return validar_resultado_epoca(resultado)


def calcular_score_resultado(
    resultado: ResultadoEpoca,
    criterio: str = CRITERIO_PADRAO,
) -> float:
    resultado_validado = validar_resultado_epoca(resultado)
    criterio_validado = validar_criterio_loop(criterio)

    return calcular_score_selecao(
        metricas=resultado_validado.metricas,
        criterio=criterio_validado,
    )


def serializar_resultado_epoca(
    resultado: ResultadoEpoca,
) -> dict[str, Any]:
    resultado_validado = validar_resultado_epoca(resultado)

    return asdict(resultado_validado)


def ordenar_resultados_por_epoca(
    resultados: Sequence[ResultadoEpoca],
) -> list[ResultadoEpoca]:
    return sorted(
        [validar_resultado_epoca(resultado) for resultado in resultados],
        key=lambda resultado: resultado.epoca,
    )


def validar_epocas_unicas(
    resultados: Sequence[ResultadoEpoca],
) -> None:
    epocas = [resultado.epoca for resultado in resultados]

    if len(epocas) != len(set(epocas)):
        raise ValueError("epocas duplicadas.")


def criar_historico_treinamento(
    resultados: Sequence[ResultadoEpoca] | None = None,
    criterio_selecao: str = CRITERIO_PADRAO,
    criterio_desempate: str = CRITERIO_DESEMPATE_PADRAO,
) -> HistoricoTreinamento:
    criterio_validado = validar_criterio_loop(criterio_selecao)
    criterio_desempate_validado = validar_criterio_loop(criterio_desempate)

    resultados_ordenados = ordenar_resultados_por_epoca(resultados or [])
    validar_epocas_unicas(resultados_ordenados)

    return HistoricoTreinamento(
        resultados=resultados_ordenados,
        criterio_selecao=criterio_validado,
        criterio_desempate=criterio_desempate_validado,
    )


def validar_historico_treinamento(
    historico: HistoricoTreinamento,
) -> HistoricoTreinamento:
    if not isinstance(historico, HistoricoTreinamento):
        raise ValueError("histórico inválido.")

    return criar_historico_treinamento(
        resultados=historico.resultados,
        criterio_selecao=historico.criterio_selecao,
        criterio_desempate=historico.criterio_desempate,
    )


def adicionar_resultado_historico(
    historico: HistoricoTreinamento,
    resultado: ResultadoEpoca,
) -> HistoricoTreinamento:
    historico_validado = validar_historico_treinamento(historico)
    resultado_validado = validar_resultado_epoca(resultado)

    resultados = [
        *historico_validado.resultados,
        resultado_validado,
    ]

    return criar_historico_treinamento(
        resultados=resultados,
        criterio_selecao=historico_validado.criterio_selecao,
        criterio_desempate=historico_validado.criterio_desempate,
    )


def obter_perda_validacao_para_desempate(
    resultado: ResultadoEpoca,
) -> float:
    if resultado.perda_validacao is None:
        return float("inf")

    return resultado.perda_validacao


def selecionar_melhor_resultado(
    resultados: Sequence[ResultadoEpoca],
    criterio: str = CRITERIO_PADRAO,
    criterio_desempate: str = CRITERIO_DESEMPATE_PADRAO,
) -> ResultadoEpoca:
    resultados_validados = ordenar_resultados_por_epoca(resultados)

    if not resultados_validados:
        raise ValueError("resultados vazios.")

    criterio_validado = validar_criterio_loop(criterio)
    criterio_desempate_validado = validar_criterio_loop(criterio_desempate)

    return max(
        resultados_validados,
        key=lambda resultado: (
            calcular_score_resultado(resultado, criterio_validado),
            calcular_score_resultado(resultado, criterio_desempate_validado),
            -obter_perda_validacao_para_desempate(resultado),
        ),
    )


def obter_melhor_resultado_historico(
    historico: HistoricoTreinamento,
) -> ResultadoEpoca:
    historico_validado = validar_historico_treinamento(historico)

    return selecionar_melhor_resultado(
        resultados=historico_validado.resultados,
        criterio=historico_validado.criterio_selecao,
        criterio_desempate=historico_validado.criterio_desempate,
    )


def calcular_epocas_sem_melhoria(
    historico: HistoricoTreinamento,
) -> int:
    historico_validado = validar_historico_treinamento(historico)

    if not historico_validado.resultados:
        return 0

    melhor = obter_melhor_resultado_historico(historico_validado)

    return sum(
        1
        for resultado in historico_validado.resultados
        if resultado.epoca > melhor.epoca
    )


def validar_paciencia(paciencia: int | None) -> int | None:
    if paciencia is None:
        return None

    paciencia_validada = int(paciencia)

    if paciencia_validada <= 0:
        raise ValueError("paciencia inválida.")

    return paciencia_validada


def deve_interromper_por_paciencia(
    historico: HistoricoTreinamento,
    paciencia: int | None,
) -> bool:
    paciencia_validada = validar_paciencia(paciencia)

    if paciencia_validada is None:
        return False

    return calcular_epocas_sem_melhoria(historico) >= paciencia_validada


def inicializar_estado_loop(
    total_epocas: int,
    criterio_selecao: str = CRITERIO_PADRAO,
) -> EstadoLoopTreino:
    if total_epocas <= 0:
        raise ValueError("total_epocas inválido.")

    criterio_validado = validar_criterio_loop(criterio_selecao)

    return EstadoLoopTreino(
        epoca_atual=0,
        total_epocas=int(total_epocas),
        criterio_selecao=criterio_validado,
    )


def validar_estado_loop(
    estado: EstadoLoopTreino,
) -> EstadoLoopTreino:
    if not isinstance(estado, EstadoLoopTreino):
        raise ValueError("estado inválido.")

    if estado.total_epocas <= 0:
        raise ValueError("total_epocas inválido.")

    if estado.epoca_atual < 0:
        raise ValueError("epoca_atual inválida.")

    if estado.epocas_sem_melhoria < 0:
        raise ValueError("epocas_sem_melhoria inválida.")

    criterio = validar_criterio_loop(estado.criterio_selecao)

    return EstadoLoopTreino(
        epoca_atual=int(estado.epoca_atual),
        total_epocas=int(estado.total_epocas),
        criterio_selecao=criterio,
        melhor_epoca=estado.melhor_epoca,
        melhor_score=estado.melhor_score,
        epocas_sem_melhoria=int(estado.epocas_sem_melhoria),
        interromper=bool(estado.interromper),
    )


def avancar_epoca_estado(
    estado: EstadoLoopTreino,
) -> EstadoLoopTreino:
    estado_validado = validar_estado_loop(estado)

    if estado_validado.epoca_atual >= estado_validado.total_epocas:
        return EstadoLoopTreino(
            epoca_atual=estado_validado.epoca_atual,
            total_epocas=estado_validado.total_epocas,
            criterio_selecao=estado_validado.criterio_selecao,
            melhor_epoca=estado_validado.melhor_epoca,
            melhor_score=estado_validado.melhor_score,
            epocas_sem_melhoria=estado_validado.epocas_sem_melhoria,
            interromper=True,
        )

    return EstadoLoopTreino(
        epoca_atual=estado_validado.epoca_atual + 1,
        total_epocas=estado_validado.total_epocas,
        criterio_selecao=estado_validado.criterio_selecao,
        melhor_epoca=estado_validado.melhor_epoca,
        melhor_score=estado_validado.melhor_score,
        epocas_sem_melhoria=estado_validado.epocas_sem_melhoria,
        interromper=False,
    )


def atualizar_estado_loop(
    estado: EstadoLoopTreino,
    historico: HistoricoTreinamento,
    paciencia: int | None = None,
) -> EstadoLoopTreino:
    estado_validado = validar_estado_loop(estado)
    historico_validado = validar_historico_treinamento(historico)

    if not historico_validado.resultados:
        return estado_validado

    melhor = obter_melhor_resultado_historico(historico_validado)
    melhor_score = calcular_score_resultado(
        melhor,
        criterio=historico_validado.criterio_selecao,
    )

    epoca_atual = max(resultado.epoca for resultado in historico_validado.resultados)

    epocas_sem_melhoria = calcular_epocas_sem_melhoria(historico_validado)

    interromper = (
        epoca_atual >= estado_validado.total_epocas
        or deve_interromper_por_paciencia(
            historico=historico_validado,
            paciencia=paciencia,
        )
    )

    return EstadoLoopTreino(
        epoca_atual=epoca_atual,
        total_epocas=estado_validado.total_epocas,
        criterio_selecao=historico_validado.criterio_selecao,
        melhor_epoca=melhor.epoca,
        melhor_score=melhor_score,
        epocas_sem_melhoria=epocas_sem_melhoria,
        interromper=interromper,
    )


def resumir_historico_treinamento(
    historico: HistoricoTreinamento,
) -> dict[str, Any]:
    historico_validado = validar_historico_treinamento(historico)

    resumo = {
        "total_epocas": len(historico_validado.resultados),
        "criterio_selecao": historico_validado.criterio_selecao,
        "criterio_desempate": historico_validado.criterio_desempate,
        "resultados": [
            serializar_resultado_epoca(resultado)
            for resultado in historico_validado.resultados
        ],
    }

    if historico_validado.resultados:
        melhor = obter_melhor_resultado_historico(historico_validado)
        resumo["melhor_epoca"] = melhor.epoca
        resumo["melhor_score"] = calcular_score_resultado(
            melhor,
            criterio=historico_validado.criterio_selecao,
        )
        resumo["epocas_sem_melhoria"] = calcular_epocas_sem_melhoria(historico_validado)
    else:
        resumo["melhor_epoca"] = None
        resumo["melhor_score"] = None
        resumo["epocas_sem_melhoria"] = 0

    return resumo
