from collections.abc import Mapping
from copy import deepcopy
from dataclasses import asdict, dataclass, field
from typing import Any

from src.treinamento.contrato_treinamento import (
    CRITERIOS_SUPORTADOS,
    MetricasClassificacao,
    validar_metricas_classificacao,
)
from src.treinamento.transforms import NormalizacaoImagem, validar_normalizacao


VERSAO_CHECKPOINT = "0.1.0"

CAMPOS_OBRIGATORIOS_CHECKPOINT = {
    "arquitetura",
    "image_size",
    "state_dict",
    "labels",
    "normalizacao",
    "metricas",
    "criterio_selecao",
    "versao",
}


@dataclass(frozen=True)
class ConfiguracaoCheckpoint:
    arquitetura: str = "efficientnet_b3"
    image_size: int = 300
    criterio_selecao: str = "recall_melanoma"
    versao: str = VERSAO_CHECKPOINT
    normalizacao: NormalizacaoImagem = field(default_factory=NormalizacaoImagem)


def validar_configuracao_checkpoint(
    configuracao: ConfiguracaoCheckpoint,
) -> ConfiguracaoCheckpoint:
    arquitetura = configuracao.arquitetura.strip()
    versao = configuracao.versao.strip()

    if not arquitetura:
        raise ValueError("arquitetura inválida.")

    if configuracao.image_size <= 0:
        raise ValueError("image_size inválido.")

    if configuracao.criterio_selecao not in CRITERIOS_SUPORTADOS:
        raise ValueError("criterio_selecao inválido.")

    if not versao:
        raise ValueError("versao inválida.")

    normalizacao = validar_normalizacao(configuracao.normalizacao)

    return ConfiguracaoCheckpoint(
        arquitetura=arquitetura,
        image_size=configuracao.image_size,
        criterio_selecao=configuracao.criterio_selecao,
        versao=versao,
        normalizacao=normalizacao,
    )


def validar_state_dict(state_dict: Mapping[str, Any]) -> Mapping[str, Any]:
    if not isinstance(state_dict, Mapping):
        raise ValueError("state_dict inválido.")

    if len(state_dict) == 0:
        raise ValueError("state_dict vazio.")

    return state_dict


def validar_labels(labels: list[dict[str, Any]]) -> list[dict[str, Any]]:
    if not isinstance(labels, list):
        raise ValueError("labels inválidos.")

    if len(labels) == 0:
        raise ValueError("labels vazios.")

    for label in labels:
        if not isinstance(label, dict):
            raise ValueError("labels inválidos.")

    return labels


def normalizacao_para_dict(
    normalizacao: NormalizacaoImagem,
) -> dict[str, list[float]]:
    normalizacao_validada = validar_normalizacao(normalizacao)

    return normalizacao_validada.para_dict()


def metricas_para_dict(
    metricas: MetricasClassificacao,
) -> dict[str, float]:
    metricas_validadas = validar_metricas_classificacao(metricas)

    return asdict(metricas_validadas)


def criar_checkpoint_producao(
    state_dict: Mapping[str, Any],
    labels: list[dict[str, Any]],
    metricas: MetricasClassificacao,
    configuracao: ConfiguracaoCheckpoint | None = None,
) -> dict[str, Any]:
    configuracao_validada = validar_configuracao_checkpoint(
        configuracao or ConfiguracaoCheckpoint()
    )

    state_dict_validado = validar_state_dict(state_dict)
    labels_validados = validar_labels(labels)

    return {
        "arquitetura": configuracao_validada.arquitetura,
        "image_size": configuracao_validada.image_size,
        "state_dict": dict(state_dict_validado),
        "labels": deepcopy(labels_validados),
        "normalizacao": normalizacao_para_dict(configuracao_validada.normalizacao),
        "metricas": metricas_para_dict(metricas),
        "criterio_selecao": configuracao_validada.criterio_selecao,
        "versao": configuracao_validada.versao,
    }


def normalizacao_de_dict(valor: Mapping[str, Any]) -> NormalizacaoImagem:
    if not isinstance(valor, Mapping):
        raise ValueError("normalizacao inválida.")

    try:
        normalizacao = NormalizacaoImagem(
            mean=tuple(valor["mean"]),
            std=tuple(valor["std"]),
        )
    except (KeyError, TypeError) as erro:
        raise ValueError("normalizacao inválida.") from erro

    return validar_normalizacao(normalizacao)


def metricas_de_dict(valor: Mapping[str, Any]) -> MetricasClassificacao:
    if not isinstance(valor, Mapping):
        raise ValueError("metricas inválidas.")

    try:
        metricas = MetricasClassificacao(**dict(valor))
    except TypeError as erro:
        raise ValueError("metricas inválidas.") from erro

    return validar_metricas_classificacao(metricas)


def validar_checkpoint_producao(
    checkpoint: Mapping[str, Any],
) -> Mapping[str, Any]:
    if not isinstance(checkpoint, Mapping):
        raise ValueError("checkpoint inválido.")

    campos_faltantes = CAMPOS_OBRIGATORIOS_CHECKPOINT - set(checkpoint.keys())

    if campos_faltantes:
        raise ValueError("checkpoint incompleto.")

    configuracao = ConfiguracaoCheckpoint(
        arquitetura=str(checkpoint["arquitetura"]),
        image_size=int(checkpoint["image_size"]),
        criterio_selecao=str(checkpoint["criterio_selecao"]),
        versao=str(checkpoint["versao"]),
        normalizacao=normalizacao_de_dict(checkpoint["normalizacao"]),
    )

    validar_configuracao_checkpoint(configuracao)
    validar_state_dict(checkpoint["state_dict"])
    validar_labels(checkpoint["labels"])
    metricas_de_dict(checkpoint["metricas"])

    return checkpoint


def extrair_metadados_checkpoint(
    checkpoint: Mapping[str, Any],
) -> dict[str, Any]:
    checkpoint_validado = validar_checkpoint_producao(checkpoint)

    return {
        chave: deepcopy(valor)
        for chave, valor in checkpoint_validado.items()
        if chave != "state_dict"
    }


def checkpoint_eh_pacote_producao(checkpoint: Mapping[str, Any]) -> bool:
    try:
        validar_checkpoint_producao(checkpoint)
    except ValueError:
        return False

    return True