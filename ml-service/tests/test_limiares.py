import pytest

from src.treinamento.limiares import (
    CLASSES_PRIORITARIAS_PADRAO,
    LIMIARES_PADRAO,
    ConfiguracaoLimiar,
    criar_configuracao_limiar,
    decidir_por_limiar,
    identificar_alertas_limiar,
    montar_candidatos_limiar,
    normalizar_probabilidades,
    obter_limiar_classe,
    serializar_configuracao_limiar,
    serializar_decisao_limiar,
)


def test_configuracao_padrao_limiar():
    configuracao = criar_configuracao_limiar()

    assert configuracao.limiar_padrao == 0.50
    assert configuracao.limiares_por_classe["mel"] == 0.35
    assert configuracao.classes_prioritarias == CLASSES_PRIORITARIAS_PADRAO


def test_rejeita_limiar_invalido():
    with pytest.raises(ValueError):
        criar_configuracao_limiar(limiar_padrao=1.2)


def test_rejeita_classe_vazia():
    with pytest.raises(ValueError):
        criar_configuracao_limiar(
            limiares_por_classe={
                "": 0.5,
            }
        )


def test_serializar_configuracao_limiar():
    configuracao = criar_configuracao_limiar()

    dados = serializar_configuracao_limiar(configuracao)

    assert dados["limiar_padrao"] == 0.50
    assert dados["limiares_por_classe"]["mel"] == 0.35


def test_obter_limiar_classe():
    assert obter_limiar_classe("mel") == LIMIARES_PADRAO["mel"]
    assert obter_limiar_classe("classe_nova") == 0.50


def test_normalizar_probabilidades_por_dict():
    probabilidades = normalizar_probabilidades(
        {
            " MEL ": "0.80",
            "nv": 0.10,
        }
    )

    assert probabilidades == {
        "mel": 0.80,
        "nv": 0.10,
    }


def test_normalizar_probabilidades_por_lista():
    probabilidades = normalizar_probabilidades(
        [
            {"codigo": "mel", "probabilidade": 0.80},
            {"codigo": "nv", "confianca": 0.10},
        ]
    )

    assert probabilidades["mel"] == 0.80
    assert probabilidades["nv"] == 0.10


def test_rejeita_probabilidade_invalida():
    with pytest.raises(ValueError):
        normalizar_probabilidades(
            {
                "mel": 1.2,
            }
        )


def test_montar_candidatos_limiar():
    candidatos = montar_candidatos_limiar(
        {
            "mel": 0.36,
            "nv": 0.80,
        }
    )

    assert candidatos[0]["codigo"] == "nv"
    assert candidatos[0]["atingiu_limiar"] is True
    assert candidatos[1]["codigo"] == "mel"
    assert candidatos[1]["atingiu_limiar"] is True


def test_decidir_por_limiar_escolhe_maior_probabilidade_acima_do_limiar():
    decisao = decidir_por_limiar(
        {
            "mel": 0.36,
            "nv": 0.80,
            "bcc": 0.20,
        }
    )

    assert decisao.codigo == "nv"
    assert decisao.probabilidade == 0.80
    assert decisao.atingiu_limiar is True
    assert decisao.origem == "limiar"


def test_decidir_por_limiar_usa_fallback_quando_nenhuma_atinge_limiar():
    configuracao = ConfiguracaoLimiar(
        limiar_padrao=0.90,
        limiares_por_classe={
            "mel": 0.90,
            "nv": 0.90,
        },
    )

    decisao = decidir_por_limiar(
        {
            "mel": 0.30,
            "nv": 0.40,
        },
        configuracao=configuracao,
    )

    assert decisao.codigo == "nv"
    assert decisao.probabilidade == 0.40
    assert decisao.atingiu_limiar is False
    assert decisao.origem == "maior_probabilidade"


def test_decidir_por_limiar_usa_prioridade_em_empate():
    decisao = decidir_por_limiar(
        {
            "mel": 0.70,
            "nv": 0.70,
        }
    )

    assert decisao.codigo == "mel"


def test_identificar_alertas_limiar():
    alertas = identificar_alertas_limiar(
        {
            "mel": 0.36,
            "bcc": 0.44,
            "nv": 0.90,
        }
    )

    assert len(alertas) == 1
    assert alertas[0]["codigo"] == "mel"


def test_serializar_decisao_limiar():
    decisao = decidir_por_limiar(
        {
            "mel": 0.36,
            "nv": 0.80,
        }
    )

    dados = serializar_decisao_limiar(decisao)

    assert dados["codigo"] == "nv"
    assert dados["origem"] == "limiar"
    assert "candidatos" in dados