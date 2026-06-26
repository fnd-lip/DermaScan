from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def test_estrutura_minima_do_ml_service():
    assert (ROOT / "src").is_dir()
    assert (ROOT / "src" / "service.py").is_file()
    assert (ROOT / "src" / "labels.json").is_file()
    assert (ROOT / "requirements.txt").is_file()
    assert (ROOT / "Dockerfile").is_file()


def test_service_declara_rotas_principais():
    conteudo = (ROOT / "src" / "service.py").read_text(encoding="utf-8")

    assert 'route="/health"' in conteudo
    assert 'route="/predict"' in conteudo
    assert "DermaScanService" in conteudo