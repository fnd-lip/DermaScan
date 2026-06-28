import json

import pytest

from src.treinamento.treinar import (
    construir_parser,
    criar_configuracao_execucao_treino,
    criar_configuracao_treinamento_base,
    executar_dry_run,
    executar_treinamento_real,
    main,
    preparar_dados_treinamento,
    resumir_preparacao_treino,
)


def criar_dataset_temporario(tmp_path):
    pasta_imagens = tmp_path / "HAM10000_images_part_1"
    pasta_imagens.mkdir()

    linhas = [
        "image_id,lesion_id,dx,age,sex,localization",
    ]

    for indice in range(10):
        image_id = f"ISIC_MEL_{indice:04d}"
        (pasta_imagens / f"{image_id}.jpg").write_text(
            "imagem",
            encoding="utf-8",
        )
        linhas.append(f"{image_id},lesao-mel-{indice},mel,60,male,back")

    for indice in range(10):
        image_id = f"ISIC_NV_{indice:04d}"
        (pasta_imagens / f"{image_id}.jpg").write_text(
            "imagem",
            encoding="utf-8",
        )
        linhas.append(f"{image_id},lesao-nv-{indice},nv,35,female,arm")

    caminho_csv = tmp_path / "HAM10000_metadata.csv"
    caminho_csv.write_text(
        "\n".join(linhas) + "\n",
        encoding="utf-8",
    )

    return tmp_path


def criar_configuracao_temporaria(tmp_path, **sobrescritas):
    criar_dataset_temporario(tmp_path)

    dados = {
        "pasta_dataset": str(tmp_path),
        "batch_size": 4,
        "epochs": 1,
        "dry_run": True,
    }

    dados.update(sobrescritas)

    return criar_configuracao_execucao_treino(**dados)


def test_criar_configuracao_execucao_treino(tmp_path):
    configuracao = criar_configuracao_temporaria(tmp_path)

    assert configuracao.pasta_dataset == str(tmp_path)
    assert configuracao.arquitetura == "efficientnet_b3"
    assert configuracao.image_size == 300
    assert configuracao.batch_size == 4
    assert configuracao.epochs == 1
    assert configuracao.dry_run is True


def test_rejeita_pasta_dataset_vazia():
    with pytest.raises(ValueError):
        criar_configuracao_execucao_treino(pasta_dataset=" ")


def test_rejeita_criterio_invalido(tmp_path):
    with pytest.raises(ValueError):
        criar_configuracao_temporaria(
            tmp_path,
            criterio_selecao="accuracy",
        )


def test_criar_configuracao_treinamento_base(tmp_path):
    configuracao = criar_configuracao_temporaria(tmp_path)

    treinamento = criar_configuracao_treinamento_base(configuracao)

    assert treinamento.dataset == "HAM10000"
    assert treinamento.image_size == 300
    assert treinamento.batch_size == 4
    assert treinamento.criterio_selecao == "recall_melanoma"


def test_preparar_dados_treinamento(tmp_path):
    configuracao = criar_configuracao_temporaria(tmp_path)

    preparacao = preparar_dados_treinamento(configuracao)

    total_split = (
        len(preparacao.itens_treino)
        + len(preparacao.itens_validacao)
        + len(preparacao.itens_teste)
    )

    assert total_split == 20
    assert len(preparacao.itens_treino) > 0
    assert len(preparacao.itens_validacao) > 0
    assert len(preparacao.itens_teste) > 0
    assert len(preparacao.itens_treino_balanceado) >= len(preparacao.itens_treino)


def test_resumir_preparacao_treino(tmp_path):
    configuracao = criar_configuracao_temporaria(tmp_path)

    preparacao = preparar_dados_treinamento(configuracao)
    resumo = resumir_preparacao_treino(preparacao)

    assert resumo["dataset"]["total"] == 20
    assert resumo["quantidades"]["treino"] > 0
    assert resumo["quantidades"]["validacao"] > 0
    assert resumo["quantidades"]["teste"] > 0


def test_executar_dry_run(tmp_path):
    configuracao = criar_configuracao_temporaria(tmp_path)

    resultado = executar_dry_run(configuracao)

    assert resultado["modo"] == "dry-run"
    assert resultado["configuracao"]["dry_run"] is True
    assert resultado["preparacao"]["dataset"]["total"] == 20


def test_executar_treinamento_real_fica_fora_do_orquestrador(tmp_path):
    configuracao = criar_configuracao_temporaria(
        tmp_path,
        dry_run=False,
    )

    with pytest.raises(NotImplementedError):
        executar_treinamento_real(configuracao)


def test_construir_parser():
    parser = construir_parser()

    args = parser.parse_args(
        [
            "--pasta-dataset",
            "dados",
            "--epochs",
            "2",
            "--batch-size",
            "8",
            "--dry-run",
        ]
    )

    assert args.pasta_dataset == "dados"
    assert args.epochs == 2
    assert args.batch_size == 8
    assert args.dry_run is True


def test_main_dry_run(tmp_path, capsys):
    criar_dataset_temporario(tmp_path)

    codigo = main(
        [
            "--pasta-dataset",
            str(tmp_path),
            "--batch-size",
            "4",
            "--dry-run",
        ]
    )

    saida = capsys.readouterr().out
    dados = json.loads(saida)

    assert codigo == 0
    assert dados["modo"] == "dry-run"
    assert dados["preparacao"]["dataset"]["total"] == 20