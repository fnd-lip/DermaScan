import pytest

from src.treinamento.checkpoint import criar_checkpoint_producao
from src.treinamento.contrato_treinamento import (
    ConfiguracaoTreinamento,
    MetricasClassificacao,
)
from src.treinamento.modelos import ConfiguracaoModelo
from src.treinamento.registro_mlflow import (
    RegistroMLflow,
    converter_valor_parametro,
    criar_registro_mlflow,
    prefixar_parametros,
    preparar_metricas_mlflow,
    preparar_parametros_mlflow,
    preparar_tags_mlflow,
    registrar_no_mlflow,
)
from src.treinamento.transforms import ConfiguracaoPreprocessamento


class ClienteMLflowFake:
    def __init__(self):
        self.parametros = {}
        self.metricas = {}
        self.tags = {}
        self.artefatos = {}

    def log_params(self, parametros):
        self.parametros.update(parametros)

    def log_metrics(self, metricas):
        self.metricas.update(metricas)

    def set_tags(self, tags):
        self.tags.update(tags)

    def log_dict(self, conteudo, caminho):
        self.artefatos[caminho] = conteudo


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


def criar_labels_validos():
    return [
        {"codigo": "mel", "nome": "Melanoma"},
        {"codigo": "nv", "nome": "Nevo melanocítico"},
    ]


def criar_checkpoint_valido():
    return criar_checkpoint_producao(
        state_dict={"classifier.weight": [0.1], "classifier.bias": [0.0]},
        labels=criar_labels_validos(),
        metricas=criar_metricas_validas(),
    )


def test_converter_valor_parametro():
    assert converter_valor_parametro(True) is True
    assert converter_valor_parametro(10) == 10
    assert converter_valor_parametro(0.1) == 0.1
    assert converter_valor_parametro(["a", "b"]) == "a,b"
    assert converter_valor_parametro({"b": 2, "a": 1}) == '{"a": 1, "b": 2}'


def test_prefixar_parametros():
    resultado = prefixar_parametros(
        "modelo",
        {
            "arquitetura": "efficientnet_b3",
            "quantidade_classes": 7,
        },
    )

    assert resultado == {
        "modelo.arquitetura": "efficientnet_b3",
        "modelo.quantidade_classes": 7,
    }


def test_preparar_parametros_mlflow():
    parametros = preparar_parametros_mlflow(
        configuracao_treinamento=ConfiguracaoTreinamento(epochs=1),
        configuracao_modelo=ConfiguracaoModelo(quantidade_classes=7),
        configuracao_preprocessamento=ConfiguracaoPreprocessamento(
            image_size=300,
            modo="treino",
        ),
    )

    assert parametros["treinamento.epochs"] == 1
    assert parametros["modelo.arquitetura"] == "efficientnet_b3"
    assert parametros["preprocessamento.image_size"] == 300


def test_preparar_metricas_mlflow():
    metricas = preparar_metricas_mlflow(criar_metricas_validas())

    assert metricas["recall_melanoma"] == 0.80
    assert metricas["macro_f1"] == 0.70


def test_preparar_tags_mlflow():
    tags = preparar_tags_mlflow(
        nome_execucao="execucao-teste",
        configuracao_treinamento=ConfiguracaoTreinamento(),
        tags_extras={"fase": "teste"},
    )

    assert tags["nome_execucao"] == "execucao-teste"
    assert tags["dataset"] == "HAM10000"
    assert tags["fase"] == "teste"


def test_criar_registro_mlflow():
    registro = criar_registro_mlflow(
        nome_execucao="execucao-teste",
        configuracao_treinamento=ConfiguracaoTreinamento(epochs=1),
        metricas=criar_metricas_validas(),
    )

    assert registro.nome_execucao == "execucao-teste"
    assert registro.parametros["treinamento.epochs"] == 1
    assert registro.metricas["recall_melanoma"] == 0.80
    assert registro.tags["criterio_selecao"] == "recall_melanoma"


def test_criar_registro_mlflow_com_checkpoint():
    registro = criar_registro_mlflow(
        nome_execucao="execucao-teste",
        configuracao_treinamento=ConfiguracaoTreinamento(),
        metricas=criar_metricas_validas(),
        checkpoint=criar_checkpoint_valido(),
    )

    assert "checkpoint_metadados" in registro.artefatos
    assert "state_dict" not in registro.artefatos["checkpoint_metadados"]


def test_registrar_no_mlflow_com_cliente_fake():
    cliente = ClienteMLflowFake()

    registro = criar_registro_mlflow(
        nome_execucao="execucao-teste",
        configuracao_treinamento=ConfiguracaoTreinamento(epochs=1),
        metricas=criar_metricas_validas(),
        checkpoint=criar_checkpoint_valido(),
    )

    resumo = registrar_no_mlflow(
        registro=registro,
        cliente_mlflow=cliente,
    )

    assert resumo["nome_execucao"] == "execucao-teste"
    assert cliente.parametros["treinamento.epochs"] == 1
    assert cliente.metricas["recall_melanoma"] == 0.80
    assert cliente.tags["nome_execucao"] == "execucao-teste"
    assert "checkpoint_metadados.json" in cliente.artefatos


def test_registrar_no_mlflow_sem_dependencia():
    registro = RegistroMLflow(
        nome_execucao="execucao-teste",
        parametros={"treinamento.epochs": 1},
        metricas={"recall_melanoma": 0.80},
        tags={"nome_execucao": "execucao-teste"},
    )

    with pytest.raises(RuntimeError):
        registrar_no_mlflow(registro)