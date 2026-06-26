from dataclasses import asdict, dataclass
from typing import Any

CRITERIOS_SUPORTADOS = {
    "recall_melanoma",
    "macro_f1",
    "auc_macro",
    "recall_alto_risco",
}


@dataclass(frozen=True)
class ConfiguracaoTreinamento:
    arquitetura: str = "efficientnet_b3"
    image_size: int = 300
    batch_size: int = 16
    learning_rate: float = 0.0001
    epochs: int = 20
    seed: int = 42
    dataset: str = "HAM10000"
    criterio_selecao: str = "recall_melanoma"


@dataclass(frozen=True)
class MetricasClassificacao:
    accuracy: float
    macro_f1: float
    auc_macro: float
    recall_melanoma: float
    precision_melanoma: float
    recall_alto_risco: float
    val_loss: float = 0.0


def validar_configuracao_treinamento(
    configuracao: ConfiguracaoTreinamento,
) -> ConfiguracaoTreinamento:
    erros: list[str] = []

    if not configuracao.arquitetura.strip():
        erros.append("A arquitetura do modelo deve ser informada.")

    if configuracao.image_size <= 0:
        erros.append("image_size deve ser maior que zero.")

    if configuracao.batch_size <= 0:
        erros.append("batch_size deve ser maior que zero.")

    if not 0 < configuracao.learning_rate < 1:
        erros.append("learning_rate deve estar entre 0 e 1.")

    if configuracao.epochs <= 0:
        erros.append("epochs deve ser maior que zero.")

    if not configuracao.dataset.strip():
        erros.append("O nome do dataset deve ser informado.")

    if configuracao.criterio_selecao not in CRITERIOS_SUPORTADOS:
        erros.append(
            "criterio_selecao inválido. "
            f"Use um destes valores: {sorted(CRITERIOS_SUPORTADOS)}."
        )

    if erros:
        raise ValueError(" ".join(erros))

    return configuracao


def validar_metricas_classificacao(
    metricas: MetricasClassificacao,
) -> MetricasClassificacao:
    valores_unitarios = {
        "accuracy": metricas.accuracy,
        "macro_f1": metricas.macro_f1,
        "auc_macro": metricas.auc_macro,
        "recall_melanoma": metricas.recall_melanoma,
        "precision_melanoma": metricas.precision_melanoma,
        "recall_alto_risco": metricas.recall_alto_risco,
    }

    for nome, valor in valores_unitarios.items():
        if not 0 <= valor <= 1:
            raise ValueError(f"{nome} deve estar entre 0 e 1.")

    if metricas.val_loss < 0:
        raise ValueError("val_loss não pode ser negativo.")

    return metricas


def calcular_score_selecao(
    metricas: MetricasClassificacao,
    criterio: str,
) -> float:
    validar_metricas_classificacao(metricas)

    if criterio not in CRITERIOS_SUPORTADOS:
        raise ValueError(
            "Critério de seleção inválido. "
            f"Use um destes valores: {sorted(CRITERIOS_SUPORTADOS)}."
        )

    return float(getattr(metricas, criterio))


def gerar_resumo_experimento(
    configuracao: ConfiguracaoTreinamento,
    metricas: MetricasClassificacao,
) -> dict[str, Any]:
    validar_configuracao_treinamento(configuracao)
    validar_metricas_classificacao(metricas)

    return {
        "configuracao": asdict(configuracao),
        "metricas": asdict(metricas),
        "criterio_selecao": configuracao.criterio_selecao,
        "score_selecao": calcular_score_selecao(
            metricas=metricas,
            criterio=configuracao.criterio_selecao,
        ),
    }
