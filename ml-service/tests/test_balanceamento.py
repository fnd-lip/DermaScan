import pytest

from src.treinamento.balanceamento import (
    ESTRATEGIA_PESOS,
    ConfiguracaoBalanceamento,
    aplicar_balanceamento,
    balancear_dataset,
    balancear_oversampling,
    balancear_subsampling,
    calcular_pesos_classes,
    calcular_pesos_itens,
    contar_classes,
    criar_configuracao_balanceamento,
    resumir_balanceamento,
    serializar_configuracao_balanceamento,
)


def criar_itens_desbalanceados():
    itens = []

    for indice in range(2):
        itens.append(
            {
                "id": f"mel-{indice}",
                "classe": "mel",
            }
        )

    for indice in range(6):
        itens.append(
            {
                "id": f"nv-{indice}",
                "classe": "nv",
            }
        )

    return itens


def ids(itens):
    return [item["id"] for item in itens]


def test_criar_configuracao_balanceamento_padrao():
    configuracao = criar_configuracao_balanceamento()

    assert configuracao.estrategia == ESTRATEGIA_PESOS
    assert configuracao.campo_rotulo == "classe"
    assert configuracao.seed == 42
    assert configuracao.limite_por_classe is None


def test_rejeita_estrategia_invalida():
    with pytest.raises(ValueError):
        criar_configuracao_balanceamento(estrategia="aleatorio")


def test_rejeita_campo_rotulo_vazio():
    with pytest.raises(ValueError):
        criar_configuracao_balanceamento(campo_rotulo=" ")


def test_serializar_configuracao_balanceamento():
    configuracao = criar_configuracao_balanceamento(
        estrategia="oversampling",
        seed=123,
        limite_por_classe=10,
    )

    dados = serializar_configuracao_balanceamento(configuracao)

    assert dados["estrategia"] == "oversampling"
    assert dados["seed"] == 123
    assert dados["limite_por_classe"] == 10


def test_contar_classes():
    contagem = contar_classes(criar_itens_desbalanceados())

    assert contagem == {
        "mel": 2,
        "nv": 6,
    }


def test_calcular_pesos_classes():
    pesos = calcular_pesos_classes(
        {
            "mel": 2,
            "nv": 6,
        }
    )

    assert pesos["mel"] == 2.0
    assert round(pesos["nv"], 4) == 0.6667


def test_calcular_pesos_itens():
    itens = criar_itens_desbalanceados()

    pesos = calcular_pesos_itens(itens)

    assert pesos[0] == 2.0
    assert round(pesos[-1], 4) == 0.6667


def test_balancear_oversampling_iguala_classes():
    resultado = balancear_oversampling(criar_itens_desbalanceados())

    assert contar_classes(resultado) == {
        "mel": 6,
        "nv": 6,
    }


def test_balancear_oversampling_e_reprodutivel():
    resultado_a = balancear_oversampling(
        criar_itens_desbalanceados(),
        seed=42,
    )

    resultado_b = balancear_oversampling(
        criar_itens_desbalanceados(),
        seed=42,
    )

    assert ids(resultado_a) == ids(resultado_b)


def test_balancear_subsampling_iguala_classes():
    resultado = balancear_subsampling(criar_itens_desbalanceados())

    assert contar_classes(resultado) == {
        "mel": 2,
        "nv": 2,
    }


def test_balancear_subsampling_e_reprodutivel():
    resultado_a = balancear_subsampling(
        criar_itens_desbalanceados(),
        seed=42,
    )

    resultado_b = balancear_subsampling(
        criar_itens_desbalanceados(),
        seed=42,
    )

    assert ids(resultado_a) == ids(resultado_b)


def test_balancear_dataset_com_estrategia_nenhum():
    itens = criar_itens_desbalanceados()

    resultado = balancear_dataset(
        itens,
        configuracao=ConfiguracaoBalanceamento(estrategia="nenhum"),
    )

    assert resultado == itens
    assert resultado is not itens


def test_aplicar_balanceamento_com_pesos():
    resultado = aplicar_balanceamento(
        criar_itens_desbalanceados(),
        configuracao=ConfiguracaoBalanceamento(estrategia="pesos"),
    )

    assert resultado.contagem_original == {
        "mel": 2,
        "nv": 6,
    }

    assert resultado.contagem_balanceada == {
        "mel": 2,
        "nv": 6,
    }

    assert resultado.pesos_classes["mel"] == 2.0


def test_aplicar_balanceamento_com_oversampling():
    resultado = aplicar_balanceamento(
        criar_itens_desbalanceados(),
        configuracao=ConfiguracaoBalanceamento(estrategia="oversampling"),
    )

    assert resultado.contagem_original == {
        "mel": 2,
        "nv": 6,
    }

    assert resultado.contagem_balanceada == {
        "mel": 6,
        "nv": 6,
    }


def test_resumir_balanceamento():
    resultado = aplicar_balanceamento(
        criar_itens_desbalanceados(),
        configuracao=ConfiguracaoBalanceamento(estrategia="subsampling"),
    )

    resumo = resumir_balanceamento(resultado)

    assert resumo["total_original"] == 8
    assert resumo["total_balanceado"] == 4
    assert resumo["contagem_balanceada"] == {
        "mel": 2,
        "nv": 2,
    }


def test_rejeita_dataset_vazio():
    with pytest.raises(ValueError):
        balancear_dataset([])


def test_rejeita_item_sem_rotulo():
    with pytest.raises(ValueError):
        aplicar_balanceamento(
            [
                {
                    "id": "imagem-1",
                }
            ]
        )


def test_rejeita_contagem_invalida():
    with pytest.raises(ValueError):
        calcular_pesos_classes(
            {
                "mel": 0,
            }
        )