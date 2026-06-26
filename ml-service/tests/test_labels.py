import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CAMINHO_LABELS = ROOT / "src" / "labels.json"


def carregar_labels():
    return json.loads(CAMINHO_LABELS.read_text(encoding="utf-8"))


def test_labels_json_tem_sete_classes():
    labels = carregar_labels()

    assert isinstance(labels, list)
    assert len(labels) == 7


def test_labels_tem_campos_obrigatorios():
    labels = carregar_labels()
    campos_obrigatorios = {"index", "codigo", "nome", "nivelAtencao"}

    for label in labels:
        assert campos_obrigatorios.issubset(label.keys())


def test_indices_das_labels_sao_continuos():
    labels = carregar_labels()
    indices = sorted(label["index"] for label in labels)

    assert indices == list(range(7))


def test_codigos_esperados_estao_presentes():
    labels = carregar_labels()
    codigos = {label["codigo"] for label in labels}

    assert codigos == {"akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"}


def test_niveis_de_atencao_sao_validos():
    labels = carregar_labels()
    niveis_validos = {"Baixo", "Atenção", "Alto"}

    for label in labels:
        assert label["nivelAtencao"] in niveis_validos