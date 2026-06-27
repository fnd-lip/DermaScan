from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass, field
from typing import Any

from src.treinamento.contrato_treinamento import (
    MetricasClassificacao,
    calcular_score_selecao,
    validar_metricas_classificacao,
)

METRICAS_OBRIGATORIAS = (
    "accuracy",
    "macro_f1",
    "auc_macro",
    "recall_melanoma",
    "precision_melanoma",
    "recall_alto_risco",
    "val_loss",
)

CRITERIO_PADRAO = "recall_melanoma"
CRITERIO_DESEMPATE_PADRAO = "macro_f1"

ALIAS_METRICAS = {
    "accuracy": "accuracy",
    "acc": "accuracy",
    "macro_f1": "macro_f1",
    "f1_macro": "macro_f1",
    "auc_macro": "auc_macro",
    "macro_auc": "auc_macro",
    "recall_melanoma": "recall_melanoma",
    "melanoma_recall": "recall_melanoma",
    "recall_mel": "recall_melanoma",
    "precision_melanoma": "precision_melanoma",
    "melanoma_precision": "precision_melanoma",
    "precision_mel": "precision_melanoma",
    "recall_alto_risco": "recall_alto_risco",
    "alto_risco_recall": "recall_alto_risco",
    "high_risk_recall": "recall_alto_risco",
    "val_loss": "val_loss",
    "loss_val": "val_loss",
}


@dataclass(frozen=True)
class ResultadoAvaliacao:
    identificador_modelo: str
    metricas: MetricasClassificacao
    parametros: dict[str, Any] = field(default_factory=dict)


def normalizar_nome_metrica(nome: str) -> str:
    return nome.strip().lower().replace("-", "_").replace(" ", "_")


def resolver_nome_metrica(nome: str) -> str:
    nome_normalizado = normalizar_nome_metrica(nome)

    try:
        return ALIAS_METRICAS[nome_normalizado]
    except KeyError as erro:
        raise ValueError("métrica não suportada.") from erro


def converter_valor_metrica(valor: Any) -> float:
    try:
        return float(valor)
    except (TypeError, ValueError) as erro:
        raise ValueError("valor de métrica inválido.") from erro


def normalizar_metricas_avaliacao(
    metricas: Mapping[str, Any],
) -> dict[str, float]:
    if not isinstance(metricas, Mapping):
        raise ValueError("métricas inválidas.")

    resultado: dict[str, float] = {}

    for nome, valor in metricas.items():
        nome_padrao = resolver_nome_metrica(str(nome))
        resultado[nome_padrao] = converter_valor_metrica(valor)

    return resultado


def criar_metricas_classificacao(
    metricas: Mapping[str, Any],
) -> MetricasClassificacao:
    metricas_normalizadas = normalizar_metricas_avaliacao(metricas)

    campos_faltantes = [
        nome for nome in METRICAS_OBRIGATORIAS if nome not in metricas_normalizadas
    ]

    if campos_faltantes:
        raise ValueError("métricas incompletas.")

    metricas_classificacao = MetricasClassificacao(
        accuracy=metricas_normalizadas["accuracy"],
        macro_f1=metricas_normalizadas["macro_f1"],
        auc_macro=metricas_normalizadas["auc_macro"],
        recall_melanoma=metricas_normalizadas["recall_melanoma"],
        precision_melanoma=metricas_normalizadas["precision_melanoma"],
        recall_alto_risco=metricas_normalizadas["recall_alto_risco"],
        val_loss=metricas_normalizadas["val_loss"],
    )

    return validar_metricas_classificacao(metricas_classificacao)


def criar_resultado_avaliacao(
    identificador_modelo: str,
    metricas: Mapping[str, Any],
    parametros: Mapping[str, Any] | None = None,
) -> ResultadoAvaliacao:
    identificador = identificador_modelo.strip()

    if not identificador:
        raise ValueError("identificador_modelo inválido.")

    return ResultadoAvaliacao(
        identificador_modelo=identificador,
        metricas=criar_metricas_classificacao(metricas),
        parametros=dict(parametros or {}),
    )


def calcular_score_avaliacao(
    metricas: MetricasClassificacao,
    criterio: str = CRITERIO_PADRAO,
) -> float:
    return calcular_score_selecao(
        metricas=metricas,
        criterio=criterio,
    )


def validar_resultado_avaliacao(
    resultado: ResultadoAvaliacao,
) -> ResultadoAvaliacao:
    if not isinstance(resultado, ResultadoAvaliacao):
        raise ValueError("resultado inválido.")

    if not resultado.identificador_modelo.strip():
        raise ValueError("identificador_modelo inválido.")

    validar_metricas_classificacao(resultado.metricas)

    return resultado


def selecionar_melhor_resultado(
    resultados: Sequence[ResultadoAvaliacao],
    criterio: str = CRITERIO_PADRAO,
    criterio_desempate: str = CRITERIO_DESEMPATE_PADRAO,
) -> ResultadoAvaliacao:
    lista_resultados = list(resultados)

    if not lista_resultados:
        raise ValueError("resultados vazios.")

    for resultado in lista_resultados:
        validar_resultado_avaliacao(resultado)

    return max(
        lista_resultados,
        key=lambda resultado: (
            calcular_score_avaliacao(resultado.metricas, criterio),
            calcular_score_avaliacao(resultado.metricas, criterio_desempate),
        ),
    )


def resumir_resultado_avaliacao(
    resultado: ResultadoAvaliacao,
    criterio: str = CRITERIO_PADRAO,
    criterio_desempate: str = CRITERIO_DESEMPATE_PADRAO,
) -> dict[str, Any]:
    resultado_validado = validar_resultado_avaliacao(resultado)

    return {
        "identificador_modelo": resultado_validado.identificador_modelo,
        "metricas": asdict(resultado_validado.metricas),
        "parametros": dict(resultado_validado.parametros),
        "criterio": criterio,
        "score": calcular_score_avaliacao(
            resultado_validado.metricas,
            criterio,
        ),
        "criterio_desempate": criterio_desempate,
        "score_desempate": calcular_score_avaliacao(
            resultado_validado.metricas,
            criterio_desempate,
        ),
    }
