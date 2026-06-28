import pytest

from src.treinamento.splits import (
    ConfiguracaoSplit,
    agrupar_por_rotulo,
    calcular_tamanhos_split,
    contar_por_rotulo,
    criar_configuracao_split,
    dividir_dataset,
    dividir_lista,
    dividir_lista_estratificada,
    embaralhar_reprodutivel,
    resumir_split,
    serializar_configuracao_split,
)


def criar_itens():
    itens = []

    for indice in range(10):
        itens.append(
            {
                "id": f"mel-{indice}",
                "classe": "mel",
            }
        )

    for indice in range(10):
        itens.append(
            {
                "id": f"nv-{indice}",
                "classe": "nv",
            }
        )

    return itens


def ids(itens):
    return [item["id"] for item in itens]


def test_criar_configuracao_split_padrao():
    configuracao = criar_configuracao_split()

    assert configuracao.proporcao_treino == 0.70
    assert configuracao.proporcao_validacao == 0.15
    assert configuracao.proporcao_teste == 0.15
    assert configuracao.seed == 42
    assert configuracao.estratificar is True


def test_rejeita_proporcoes_invalidas():
    with pytest.raises(ValueError):
        criar_configuracao_split(
            proporcao_treino=0.80,
            proporcao_validacao=0.15,
            proporcao_teste=0.15,
        )


def test_rejeita_proporcao_negativa():
    with pytest.raises(ValueError):
        criar_configuracao_split(
            proporcao_treino=-0.10,
            proporcao_validacao=0.20,
            proporcao_teste=0.90,
        )


def test_rejeita_campo_rotulo_vazio():
    with pytest.raises(ValueError):
        criar_configuracao_split(campo_rotulo=" ")


def test_serializar_configuracao_split():
    configuracao = criar_configuracao_split(seed=123)

    dados = serializar_configuracao_split(configuracao)

    assert dados["seed"] == 123
    assert dados["campo_rotulo"] == "classe"


def test_embaralhar_reprodutivel():
    itens = list(range(10))

    resultado_a = embaralhar_reprodutivel(itens, seed=42)
    resultado_b = embaralhar_reprodutivel(itens, seed=42)

    assert resultado_a == resultado_b
    assert resultado_a != itens


def test_calcular_tamanhos_split():
    tamanhos = calcular_tamanhos_split(20)

    assert tamanhos == {
        "treino": 14,
        "validacao": 3,
        "teste": 3,
    }


def test_dividir_lista_sem_estratificacao():
    resultado = dividir_lista(
        list(range(20)),
        configuracao=ConfiguracaoSplit(estratificar=False),
    )

    assert len(resultado.treino) == 14
    assert len(resultado.validacao) == 3
    assert len(resultado.teste) == 3


def test_agrupar_por_rotulo():
    grupos = agrupar_por_rotulo(criar_itens())

    assert len(grupos["mel"]) == 10
    assert len(grupos["nv"]) == 10


def test_contar_por_rotulo():
    contagem = contar_por_rotulo(criar_itens())

    assert contagem == {
        "mel": 10,
        "nv": 10,
    }


def test_dividir_lista_estratificada_mantem_rotulos():
    resultado = dividir_lista_estratificada(criar_itens())

    assert contar_por_rotulo(resultado.treino) == {
        "mel": 7,
        "nv": 7,
    }

    assert contar_por_rotulo(resultado.validacao) == {
        "mel": 1,
        "nv": 1,
    }

    assert contar_por_rotulo(resultado.teste) == {
        "mel": 2,
        "nv": 2,
    }


def test_dividir_dataset_padrao_usa_estratificacao():
    resultado = dividir_dataset(criar_itens())

    assert len(resultado.treino) == 14
    assert len(resultado.validacao) == 2
    assert len(resultado.teste) == 4
    assert resultado.configuracao.estratificar is True


def test_dividir_dataset_reprodutivel():
    resultado_a = dividir_dataset(criar_itens())
    resultado_b = dividir_dataset(criar_itens())

    assert ids(resultado_a.treino) == ids(resultado_b.treino)
    assert ids(resultado_a.validacao) == ids(resultado_b.validacao)
    assert ids(resultado_a.teste) == ids(resultado_b.teste)


def test_dividir_dataset_com_seed_diferente_muda_ordem():
    resultado_a = dividir_dataset(criar_itens(), ConfiguracaoSplit(seed=42))
    resultado_b = dividir_dataset(criar_itens(), ConfiguracaoSplit(seed=99))

    assert ids(resultado_a.treino) != ids(resultado_b.treino)


def test_rejeita_dataset_vazio():
    with pytest.raises(ValueError):
        dividir_dataset([])


def test_rejeita_item_sem_rotulo():
    with pytest.raises(ValueError):
        dividir_dataset(
            [
                {
                    "id": "imagem-1",
                }
            ]
        )


def test_resumir_split():
    resultado = dividir_dataset(criar_itens())

    resumo = resumir_split(resultado)

    assert resumo["treino"] == 14
    assert resumo["validacao"] == 2
    assert resumo["teste"] == 4
    assert resumo["total"] == 20
    assert resumo["rotulos"]["treino"]["mel"] == 7
    assert resumo["rotulos"]["teste"]["nv"] == 2
