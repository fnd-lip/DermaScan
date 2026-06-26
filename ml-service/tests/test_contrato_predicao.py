from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CAMINHO_SERVICE = ROOT / "src" / "service.py"


def test_service_retorna_campos_do_contrato_de_predicao():
    conteudo = CAMINHO_SERVICE.read_text(encoding="utf-8")

    campos_esperados = [
        "classePrevista",
        "codigo",
        "confianca",
        "nivelAtencao",
        "probabilidades",
        "fonte",
    ]

    for campo in campos_esperados:
        assert campo in conteudo


def test_service_recebe_imagem_em_base64():
    conteudo = CAMINHO_SERVICE.read_text(encoding="utf-8")

    assert "imageBase64" in conteudo
    assert "converter_base64_para_imagem" in conteudo