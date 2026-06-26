from pathlib import Path

import pytest


ROOT = Path(__file__).resolve().parents[1]
CAMINHO_MODELO = ROOT / "models" / "modelo_dermascan.pth"


def test_modelo_pode_estar_ausente_no_repositorio():
    if not CAMINHO_MODELO.exists():
        pytest.skip(
            "Modelo não encontrado em models/modelo_dermascan.pth. "
            "Isso é aceitável quando o artefato pesado não está versionado no Git."
        )

    assert CAMINHO_MODELO.is_file()


def test_checkpoint_do_modelo_tem_formato_esperado_quando_presente():
    if not CAMINHO_MODELO.exists():
        pytest.skip("Modelo ausente. Validação de checkpoint ignorada.")

    torch = pytest.importorskip("torch")

    checkpoint = torch.load(
        CAMINHO_MODELO,
        map_location="cpu",
    )

    assert isinstance(checkpoint, dict)
    assert "state_dict" in checkpoint, (
        "O ml-service atual espera checkpoint['state_dict']. "
        "Se o arquivo for um state_dict puro, será necessário empacotar "
        "o modelo em um checkpoint de produção."
    )