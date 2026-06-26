import pytest

from src.observability.mlflow_dagshub import (
    ConfiguracaoMLflowDagsHub,
    carregar_configuracao_do_ambiente,
    montar_tracking_uri_dagshub,
)


def test_montar_tracking_uri_dagshub():
    uri = montar_tracking_uri_dagshub(
        usuario="felipe",
        repositorio="DermaScan",
    )

    assert uri == "https://dagshub.com/felipe/DermaScan.mlflow"


def test_montar_tracking_uri_remove_barras_externas():
    uri = montar_tracking_uri_dagshub(
        usuario="/felipe/",
        repositorio="/DermaScan/",
    )

    assert uri == "https://dagshub.com/felipe/DermaScan.mlflow"


def test_montar_tracking_uri_rejeita_espacos():
    with pytest.raises(ValueError):
        montar_tracking_uri_dagshub(
            usuario="felipe teste",
            repositorio="DermaScan",
        )


def test_configuracao_usa_tracking_uri_customizado():
    configuracao = ConfiguracaoMLflowDagsHub(
        tracking_uri="http://localhost:5000",
        experimento="teste",
    )

    assert configuracao.uri_final() == "http://localhost:5000"


def test_carregar_configuracao_do_ambiente(monkeypatch):
    monkeypatch.setenv("DAGSHUB_USER", "felipe")
    monkeypatch.setenv("DAGSHUB_REPO", "DermaScan")
    monkeypatch.setenv("MLFLOW_EXPERIMENT_NAME", "experimento-teste")

    configuracao = carregar_configuracao_do_ambiente()

    assert configuracao.usuario == "felipe"
    assert configuracao.repositorio == "DermaScan"
    assert configuracao.experimento == "experimento-teste"
    assert configuracao.uri_final() == "https://dagshub.com/felipe/DermaScan.mlflow"


def test_configuracao_exige_usuario_quando_sem_tracking_uri():
    configuracao = ConfiguracaoMLflowDagsHub(
        usuario="",
        repositorio="DermaScan",
    )

    with pytest.raises(ValueError):
        configuracao.uri_final()