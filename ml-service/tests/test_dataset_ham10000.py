import pytest

from src.treinamento.dataset_ham10000 import (
    CLASSES_HAM10000,
    carregar_dataset_ham10000,
    contar_classes_ham10000,
    criar_configuracao_dataset_ham10000,
    criar_registro_ham10000,
    filtrar_registros_por_classe,
    gerar_nomes_arquivo_imagem,
    ler_metadados_csv,
    montar_candidatos_imagem,
    obter_rotulos_ham10000,
    preparar_itens_treinamento_ham10000,
    resolver_caminho_imagem,
    resolver_caminho_metadados,
    resumir_dataset_ham10000,
    serializar_configuracao_dataset_ham10000,
    validar_classe_ham10000,
)


def criar_dataset_temporario(tmp_path):
    pasta_imagens = tmp_path / "HAM10000_images_part_1"
    pasta_imagens.mkdir()

    for image_id in ["ISIC_0001", "ISIC_0002", "ISIC_0003"]:
        (pasta_imagens / f"{image_id}.jpg").write_text(
            "imagem",
            encoding="utf-8",
        )

    caminho_csv = tmp_path / "HAM10000_metadata.csv"
    caminho_csv.write_text(
        "image_id,lesion_id,dx,age,sex,localization\n"
        "ISIC_0001,lesao-1,mel,60,male,back\n"
        "ISIC_0002,lesao-2,nv,35,female,arm\n"
        "ISIC_0003,lesao-3,nv,40,male,face\n",
        encoding="utf-8",
    )

    return caminho_csv


def criar_configuracao_temporaria(tmp_path):
    criar_dataset_temporario(tmp_path)

    return criar_configuracao_dataset_ham10000(
        pasta_dataset=str(tmp_path),
        validar_arquivo_imagem=True,
    )


def test_classes_ham10000_padrao():
    assert CLASSES_HAM10000 == (
        "akiec",
        "bcc",
        "bkl",
        "df",
        "mel",
        "nv",
        "vasc",
    )


def test_criar_configuracao_dataset_ham10000_padrao():
    configuracao = criar_configuracao_dataset_ham10000(
        validar_arquivo_imagem=False,
    )

    assert configuracao.arquivo_metadados == "HAM10000_metadata.csv"
    assert configuracao.campo_imagem == "image_id"
    assert configuracao.campo_classe == "dx"
    assert configuracao.classes_validas == CLASSES_HAM10000
    assert configuracao.validar_arquivo_imagem is False


def test_rejeita_campo_imagem_vazio():
    with pytest.raises(ValueError):
        criar_configuracao_dataset_ham10000(campo_imagem=" ")


def test_rejeita_extensao_vazia():
    with pytest.raises(ValueError):
        criar_configuracao_dataset_ham10000(extensoes_imagem=[""])


def test_serializar_configuracao_dataset_ham10000(tmp_path):
    configuracao = criar_configuracao_dataset_ham10000(
        pasta_dataset=str(tmp_path),
        extensoes_imagem=["jpg"],
        validar_arquivo_imagem=False,
    )

    dados = serializar_configuracao_dataset_ham10000(configuracao)

    assert dados["pasta_dataset"] == str(tmp_path)
    assert dados["extensoes_imagem"] == (".jpg",)


def test_validar_classe_ham10000():
    assert validar_classe_ham10000(" MEL ") == "mel"


def test_rejeita_classe_invalida():
    with pytest.raises(ValueError):
        validar_classe_ham10000("outra")


def test_resolver_caminho_metadados(tmp_path):
    configuracao = criar_configuracao_dataset_ham10000(
        pasta_dataset=str(tmp_path),
        validar_arquivo_imagem=False,
    )

    assert resolver_caminho_metadados(configuracao) == (
        tmp_path / "HAM10000_metadata.csv"
    )


def test_gerar_nomes_arquivo_imagem():
    assert gerar_nomes_arquivo_imagem("ISIC_0001", ["jpg", ".png"]) == [
        "ISIC_0001.jpg",
        "ISIC_0001.png",
    ]

    assert gerar_nomes_arquivo_imagem("ISIC_0001.jpg") == ["ISIC_0001.jpg"]


def test_montar_candidatos_imagem(tmp_path):
    configuracao = criar_configuracao_dataset_ham10000(
        pasta_dataset=str(tmp_path),
        validar_arquivo_imagem=False,
    )

    candidatos = montar_candidatos_imagem("ISIC_0001", configuracao)

    assert tmp_path / "ISIC_0001.jpg" in candidatos
    assert tmp_path / "HAM10000_images_part_1" / "ISIC_0001.jpg" in candidatos


def test_resolver_caminho_imagem_encontra_arquivo_em_pasta_padrao(tmp_path):
    configuracao = criar_configuracao_temporaria(tmp_path)

    caminho = resolver_caminho_imagem("ISIC_0001", configuracao)

    assert caminho.endswith("ISIC_0001.jpg")


def test_resolver_caminho_imagem_rejeita_ausente(tmp_path):
    configuracao = criar_configuracao_dataset_ham10000(
        pasta_dataset=str(tmp_path),
        validar_arquivo_imagem=True,
    )

    with pytest.raises(ValueError):
        resolver_caminho_imagem("ISIC_9999", configuracao)


def test_resolver_caminho_imagem_sem_validar_retorna_candidato(tmp_path):
    configuracao = criar_configuracao_dataset_ham10000(
        pasta_dataset=str(tmp_path),
        validar_arquivo_imagem=False,
    )

    caminho = resolver_caminho_imagem("ISIC_9999", configuracao)

    assert caminho.endswith("ISIC_9999.jpg")


def test_ler_metadados_csv(tmp_path):
    caminho_csv = criar_dataset_temporario(tmp_path)

    linhas = ler_metadados_csv(caminho_csv)

    assert len(linhas) == 3
    assert linhas[0]["image_id"] == "ISIC_0001"
    assert linhas[0]["dx"] == "mel"


def test_ler_metadados_csv_rejeita_colunas_incompletas(tmp_path):
    caminho_csv = tmp_path / "HAM10000_metadata.csv"
    caminho_csv.write_text(
        "image_id,age\nISIC_0001,60\n",
        encoding="utf-8",
    )

    with pytest.raises(ValueError):
        ler_metadados_csv(caminho_csv)


def test_criar_registro_ham10000(tmp_path):
    configuracao = criar_configuracao_temporaria(tmp_path)

    registro = criar_registro_ham10000(
        {
            "image_id": "ISIC_0001",
            "dx": "mel",
            "age": "60",
        },
        configuracao=configuracao,
    )

    assert registro.image_id == "ISIC_0001"
    assert registro.classe == "mel"
    assert registro.metadados["age"] == "60"


def test_carregar_dataset_ham10000(tmp_path):
    configuracao = criar_configuracao_temporaria(tmp_path)

    resultado = carregar_dataset_ham10000(configuracao)

    assert len(resultado.registros) == 3
    assert resultado.registros[0].classe == "mel"


def test_contar_filtrar_e_obter_rotulos(tmp_path):
    resultado = carregar_dataset_ham10000(
        criar_configuracao_temporaria(tmp_path)
    )

    assert contar_classes_ham10000(resultado.registros) == {
        "mel": 1,
        "nv": 2,
    }

    assert len(filtrar_registros_por_classe(resultado.registros, "nv")) == 2
    assert obter_rotulos_ham10000(resultado.registros) == ["mel", "nv", "nv"]


def test_preparar_itens_treinamento_ham10000(tmp_path):
    resultado = carregar_dataset_ham10000(
        criar_configuracao_temporaria(tmp_path)
    )

    itens = preparar_itens_treinamento_ham10000(resultado.registros)

    assert itens[0]["id"] == "ISIC_0001"
    assert itens[0]["classe"] == "mel"
    assert "caminho_imagem" in itens[0]


def test_resumir_dataset_ham10000(tmp_path):
    resultado = carregar_dataset_ham10000(
        criar_configuracao_temporaria(tmp_path)
    )

    resumo = resumir_dataset_ham10000(resultado)

    assert resumo["total"] == 3
    assert resumo["classes"] == {
        "mel": 1,
        "nv": 2,
    }
    assert resumo["imagens_com_caminho"] == 3
    assert resumo["configuracao"]["campo_classe"] == "dx"