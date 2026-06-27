from collections.abc import Mapping
from dataclasses import dataclass, field
from importlib import import_module
import json
from typing import Any

from src.treinamento.checkpoint import extrair_metadados_checkpoint
from src.treinamento.contrato_treinamento import (
    ConfiguracaoTreinamento,
    MetricasClassificacao,
    validar_configuracao_treinamento,
    validar_metricas_classificacao,
)
from src.treinamento.modelos import (
    ConfiguracaoModelo,
    serializar_configuracao_modelo,
)
from src.treinamento.transforms import (
    ConfiguracaoPreprocessamento,
    serializar_configuracao_preprocessamento,
)


ValorParametro = str | int | float | bool


@dataclass(frozen=True)
class RegistroMLflow:
    nome_execucao: str
    parametros: dict[str, ValorParametro]
    metricas: dict[str, float]
    tags: dict[str, str]
    artefatos: dict[str, Any] = field(default_factory=dict)


def converter_valor_parametro(valor: Any) -> ValorParametro:
    if isinstance(valor, bool):
        return valor

    if isinstance(valor, int | float | str):
        return valor

    if valor is None:
        return ""

    if isinstance(valor, set):
        return ",".join(str(item) for item in sorted(valor))

    if isinstance(valor, list | tuple):
        return ",".join(str(item) for item in valor)

    if isinstance(valor, Mapping):
        return json.dumps(
            dict(valor),
            ensure_ascii=False,
            sort_keys=True,
        )

    return str(valor)


def prefixar_parametros(
    prefixo: str,
    dados: Mapping[str, Any],
) -> dict[str, ValorParametro]:
    prefixo_normalizado = prefixo.strip().strip(".")

    if not prefixo_normalizado:
        raise ValueError("prefixo inválido.")

    return {
        f"{prefixo_normalizado}.{chave}": converter_valor_parametro(valor)
        for chave, valor in dados.items()
    }


def preparar_parametros_mlflow(
    configuracao_treinamento: ConfiguracaoTreinamento,
    configuracao_modelo: ConfiguracaoModelo | None = None,
    configuracao_preprocessamento: ConfiguracaoPreprocessamento | None = None,
) -> dict[str, ValorParametro]:
    treinamento_validado = validar_configuracao_treinamento(
        configuracao_treinamento
    )

    modelo_serializado = serializar_configuracao_modelo(
        configuracao_modelo or ConfiguracaoModelo()
    )

    preprocessamento_serializado = serializar_configuracao_preprocessamento(
        configuracao_preprocessamento or ConfiguracaoPreprocessamento()
    )

    parametros: dict[str, ValorParametro] = {}

    parametros.update(
        prefixar_parametros(
            "treinamento",
            treinamento_validado.__dict__,
        )
    )

    parametros.update(
        prefixar_parametros(
            "modelo",
            modelo_serializado,
        )
    )

    parametros.update(
        prefixar_parametros(
            "preprocessamento",
            preprocessamento_serializado,
        )
    )

    return parametros


def preparar_metricas_mlflow(
    metricas: MetricasClassificacao,
) -> dict[str, float]:
    metricas_validadas = validar_metricas_classificacao(metricas)

    return {
        chave: float(valor)
        for chave, valor in metricas_validadas.__dict__.items()
    }


def validar_nome_execucao(nome_execucao: str) -> str:
    nome = nome_execucao.strip()

    if not nome:
        raise ValueError("nome_execucao inválido.")

    return nome


def preparar_tags_mlflow(
    nome_execucao: str,
    configuracao_treinamento: ConfiguracaoTreinamento,
    tags_extras: Mapping[str, Any] | None = None,
) -> dict[str, str]:
    nome = validar_nome_execucao(nome_execucao)
    configuracao_validada = validar_configuracao_treinamento(
        configuracao_treinamento
    )

    tags = {
        "nome_execucao": nome,
        "dataset": configuracao_validada.dataset,
        "arquitetura": configuracao_validada.arquitetura,
        "criterio_selecao": configuracao_validada.criterio_selecao,
    }

    if tags_extras:
        for chave, valor in tags_extras.items():
            if valor is not None:
                tags[str(chave)] = str(valor)

    return tags


def criar_registro_mlflow(
    nome_execucao: str,
    configuracao_treinamento: ConfiguracaoTreinamento,
    metricas: MetricasClassificacao,
    configuracao_modelo: ConfiguracaoModelo | None = None,
    configuracao_preprocessamento: ConfiguracaoPreprocessamento | None = None,
    checkpoint: Mapping[str, Any] | None = None,
    tags_extras: Mapping[str, Any] | None = None,
) -> RegistroMLflow:
    parametros = preparar_parametros_mlflow(
        configuracao_treinamento=configuracao_treinamento,
        configuracao_modelo=configuracao_modelo,
        configuracao_preprocessamento=configuracao_preprocessamento,
    )

    artefatos: dict[str, Any] = {}

    if checkpoint is not None:
        artefatos["checkpoint_metadados"] = extrair_metadados_checkpoint(
            checkpoint
        )

    return RegistroMLflow(
        nome_execucao=validar_nome_execucao(nome_execucao),
        parametros=parametros,
        metricas=preparar_metricas_mlflow(metricas),
        tags=preparar_tags_mlflow(
            nome_execucao=nome_execucao,
            configuracao_treinamento=configuracao_treinamento,
            tags_extras=tags_extras,
        ),
        artefatos=artefatos,
    )


def validar_registro_mlflow(registro: RegistroMLflow) -> RegistroMLflow:
    validar_nome_execucao(registro.nome_execucao)

    if not registro.parametros:
        raise ValueError("parametros inválidos.")

    if not registro.metricas:
        raise ValueError("metricas inválidas.")

    if not registro.tags:
        raise ValueError("tags inválidas.")

    return registro


def carregar_mlflow() -> Any:
    try:
        return import_module("mlflow")
    except ModuleNotFoundError as erro:
        raise RuntimeError("Dependência mlflow não disponível.") from erro


def validar_cliente_mlflow(cliente_mlflow: Any) -> Any:
    metodos_obrigatorios = [
        "log_params",
        "log_metrics",
    ]

    for metodo in metodos_obrigatorios:
        if not hasattr(cliente_mlflow, metodo):
            raise ValueError("cliente_mlflow inválido.")

    if not hasattr(cliente_mlflow, "set_tags") and not hasattr(
        cliente_mlflow,
        "set_tag",
    ):
        raise ValueError("cliente_mlflow inválido.")

    return cliente_mlflow


def aplicar_tags(cliente_mlflow: Any, tags: Mapping[str, str]) -> None:
    if hasattr(cliente_mlflow, "set_tags"):
        cliente_mlflow.set_tags(dict(tags))
        return

    for chave, valor in tags.items():
        cliente_mlflow.set_tag(chave, valor)


def registrar_artefatos(
    cliente_mlflow: Any,
    artefatos: Mapping[str, Any],
) -> None:
    if not artefatos:
        return

    if not hasattr(cliente_mlflow, "log_dict"):
        return

    for nome, conteudo in artefatos.items():
        cliente_mlflow.log_dict(
            conteudo,
            f"{nome}.json",
        )


def registrar_no_mlflow(
    registro: RegistroMLflow,
    cliente_mlflow: Any | None = None,
) -> dict[str, int | str]:
    registro_validado = validar_registro_mlflow(registro)
    cliente = validar_cliente_mlflow(cliente_mlflow or carregar_mlflow())

    cliente.log_params(registro_validado.parametros)
    cliente.log_metrics(registro_validado.metricas)
    aplicar_tags(cliente, registro_validado.tags)
    registrar_artefatos(cliente, registro_validado.artefatos)

    return {
        "nome_execucao": registro_validado.nome_execucao,
        "parametros": len(registro_validado.parametros),
        "metricas": len(registro_validado.metricas),
        "tags": len(registro_validado.tags),
        "artefatos": len(registro_validado.artefatos),
    }