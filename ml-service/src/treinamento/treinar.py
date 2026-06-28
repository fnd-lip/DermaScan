from argparse import ArgumentParser
from dataclasses import asdict, dataclass
import json
from typing import Any, Sequence

from src.treinamento.balanceamento import (
    ConfiguracaoBalanceamento,
    aplicar_balanceamento,
)
from src.treinamento.contrato_treinamento import (
    CRITERIOS_SUPORTADOS,
    ConfiguracaoTreinamento,
    validar_configuracao_treinamento,
)
from src.treinamento.dataset_ham10000 import (
    ConfiguracaoDatasetHAM10000,
    carregar_dataset_ham10000,
    preparar_itens_treinamento_ham10000,
    resumir_dataset_ham10000,
)
from src.treinamento.splits import (
    ConfiguracaoSplit,
    dividir_dataset,
    resumir_split,
)


@dataclass(frozen=True)
class ConfiguracaoExecucaoTreino:
    pasta_dataset: str
    pasta_imagens: str = ""
    arquivo_metadados: str = "HAM10000_metadata.csv"
    arquitetura: str = "efficientnet_b3"
    image_size: int = 300
    batch_size: int = 16
    epochs: int = 1
    learning_rate: float = 0.0001
    seed: int = 42
    criterio_selecao: str = "recall_melanoma"
    estrategia_balanceamento: str = "pesos"
    validar_arquivo_imagem: bool = True
    dry_run: bool = True


@dataclass(frozen=True)
class ResultadoPreparacaoTreino:
    itens_treino: list[dict[str, Any]]
    itens_validacao: list[dict[str, Any]]
    itens_teste: list[dict[str, Any]]
    itens_treino_balanceado: list[dict[str, Any]]
    resumo_dataset: dict[str, Any]
    resumo_split: dict[str, Any]
    resumo_balanceamento: dict[str, Any]


def validar_texto_obrigatorio(valor: str, nome: str) -> str:
    texto = str(valor).strip()

    if not texto:
        raise ValueError(f"{nome} inválido.")

    return texto


def validar_numero_positivo(valor: Any, nome: str) -> float:
    try:
        numero = float(valor)
    except (TypeError, ValueError) as erro:
        raise ValueError(f"{nome} inválido.") from erro

    if numero <= 0:
        raise ValueError(f"{nome} inválido.")

    return numero


def validar_configuracao_execucao_treino(
    configuracao: ConfiguracaoExecucaoTreino,
) -> ConfiguracaoExecucaoTreino:
    pasta_dataset = validar_texto_obrigatorio(
        configuracao.pasta_dataset,
        "pasta_dataset",
    )

    criterio_selecao = validar_texto_obrigatorio(
        configuracao.criterio_selecao,
        "criterio_selecao",
    )

    if criterio_selecao not in CRITERIOS_SUPORTADOS:
        raise ValueError("criterio_selecao inválido.")

    return ConfiguracaoExecucaoTreino(
        pasta_dataset=pasta_dataset,
        pasta_imagens=str(configuracao.pasta_imagens).strip(),
        arquivo_metadados=validar_texto_obrigatorio(
            configuracao.arquivo_metadados,
            "arquivo_metadados",
        ),
        arquitetura=validar_texto_obrigatorio(
            configuracao.arquitetura,
            "arquitetura",
        ),
        image_size=int(
            validar_numero_positivo(
                configuracao.image_size,
                "image_size",
            )
        ),
        batch_size=int(
            validar_numero_positivo(
                configuracao.batch_size,
                "batch_size",
            )
        ),
        epochs=int(
            validar_numero_positivo(
                configuracao.epochs,
                "epochs",
            )
        ),
        learning_rate=validar_numero_positivo(
            configuracao.learning_rate,
            "learning_rate",
        ),
        seed=int(configuracao.seed),
        criterio_selecao=criterio_selecao,
        estrategia_balanceamento=validar_texto_obrigatorio(
            configuracao.estrategia_balanceamento,
            "estrategia_balanceamento",
        ),
        validar_arquivo_imagem=bool(configuracao.validar_arquivo_imagem),
        dry_run=bool(configuracao.dry_run),
    )


def criar_configuracao_execucao_treino(
    pasta_dataset: str,
    pasta_imagens: str = "",
    arquivo_metadados: str = "HAM10000_metadata.csv",
    arquitetura: str = "efficientnet_b3",
    image_size: int = 300,
    batch_size: int = 16,
    epochs: int = 1,
    learning_rate: float = 0.0001,
    seed: int = 42,
    criterio_selecao: str = "recall_melanoma",
    estrategia_balanceamento: str = "pesos",
    validar_arquivo_imagem: bool = True,
    dry_run: bool = True,
) -> ConfiguracaoExecucaoTreino:
    configuracao = ConfiguracaoExecucaoTreino(
        pasta_dataset=pasta_dataset,
        pasta_imagens=pasta_imagens,
        arquivo_metadados=arquivo_metadados,
        arquitetura=arquitetura,
        image_size=image_size,
        batch_size=batch_size,
        epochs=epochs,
        learning_rate=learning_rate,
        seed=seed,
        criterio_selecao=criterio_selecao,
        estrategia_balanceamento=estrategia_balanceamento,
        validar_arquivo_imagem=validar_arquivo_imagem,
        dry_run=dry_run,
    )

    return validar_configuracao_execucao_treino(configuracao)


def criar_configuracao_treinamento_base(
    configuracao: ConfiguracaoExecucaoTreino,
) -> ConfiguracaoTreinamento:
    configuracao_validada = validar_configuracao_execucao_treino(configuracao)

    return validar_configuracao_treinamento(
        ConfiguracaoTreinamento(
            arquitetura=configuracao_validada.arquitetura,
            image_size=configuracao_validada.image_size,
            batch_size=configuracao_validada.batch_size,
            learning_rate=configuracao_validada.learning_rate,
            epochs=configuracao_validada.epochs,
            seed=configuracao_validada.seed,
            dataset="HAM10000",
            criterio_selecao=configuracao_validada.criterio_selecao,
        )
    )


def criar_configuracao_dataset(
    configuracao: ConfiguracaoExecucaoTreino,
) -> ConfiguracaoDatasetHAM10000:
    configuracao_validada = validar_configuracao_execucao_treino(configuracao)

    return ConfiguracaoDatasetHAM10000(
        pasta_dataset=configuracao_validada.pasta_dataset,
        pasta_imagens=configuracao_validada.pasta_imagens,
        arquivo_metadados=configuracao_validada.arquivo_metadados,
        validar_arquivo_imagem=configuracao_validada.validar_arquivo_imagem,
    )


def criar_configuracao_split(
    configuracao: ConfiguracaoExecucaoTreino,
) -> ConfiguracaoSplit:
    configuracao_validada = validar_configuracao_execucao_treino(configuracao)

    return ConfiguracaoSplit(
        seed=configuracao_validada.seed,
        estratificar=True,
        campo_rotulo="classe",
    )


def criar_configuracao_balanceamento_execucao(
    configuracao: ConfiguracaoExecucaoTreino,
) -> ConfiguracaoBalanceamento:
    configuracao_validada = validar_configuracao_execucao_treino(configuracao)

    return ConfiguracaoBalanceamento(
        estrategia=configuracao_validada.estrategia_balanceamento,
        campo_rotulo="classe",
        seed=configuracao_validada.seed,
    )


def preparar_dados_treinamento(
    configuracao: ConfiguracaoExecucaoTreino,
) -> ResultadoPreparacaoTreino:
    configuracao_validada = validar_configuracao_execucao_treino(configuracao)

    resultado_dataset = carregar_dataset_ham10000(
        criar_configuracao_dataset(configuracao_validada)
    )

    itens = preparar_itens_treinamento_ham10000(
        resultado_dataset.registros
    )

    resultado_split = dividir_dataset(
        itens=itens,
        configuracao=criar_configuracao_split(configuracao_validada),
    )

    resultado_balanceamento = aplicar_balanceamento(
        itens=resultado_split.treino,
        configuracao=criar_configuracao_balanceamento_execucao(
            configuracao_validada
        ),
    )

    return ResultadoPreparacaoTreino(
        itens_treino=resultado_split.treino,
        itens_validacao=resultado_split.validacao,
        itens_teste=resultado_split.teste,
        itens_treino_balanceado=resultado_balanceamento.itens,
        resumo_dataset=resumir_dataset_ham10000(resultado_dataset),
        resumo_split=resumir_split(resultado_split),
        resumo_balanceamento={
            "contagem_original": dict(resultado_balanceamento.contagem_original),
            "contagem_balanceada": dict(resultado_balanceamento.contagem_balanceada),
            "pesos_classes": dict(resultado_balanceamento.pesos_classes),
        },
    )


def resumir_preparacao_treino(
    resultado: ResultadoPreparacaoTreino,
) -> dict[str, Any]:
    if not isinstance(resultado, ResultadoPreparacaoTreino):
        raise ValueError("resultado inválido.")

    return {
        "dataset": resultado.resumo_dataset,
        "split": resultado.resumo_split,
        "balanceamento": resultado.resumo_balanceamento,
        "quantidades": {
            "treino": len(resultado.itens_treino),
            "validacao": len(resultado.itens_validacao),
            "teste": len(resultado.itens_teste),
            "treino_balanceado": len(resultado.itens_treino_balanceado),
        },
    }


def executar_dry_run(
    configuracao: ConfiguracaoExecucaoTreino,
) -> dict[str, Any]:
    configuracao_validada = validar_configuracao_execucao_treino(configuracao)
    preparacao = preparar_dados_treinamento(configuracao_validada)

    return {
        "modo": "dry-run",
        "configuracao": asdict(configuracao_validada),
        "preparacao": resumir_preparacao_treino(preparacao),
    }


def executar_treinamento_real(
    configuracao: ConfiguracaoExecucaoTreino,
) -> dict[str, Any]:
    validar_configuracao_execucao_treino(configuracao)

    raise NotImplementedError(
        "Treino real deve ficar em executor_torch.py."
    )


def construir_parser() -> ArgumentParser:
    parser = ArgumentParser(
        prog="treinar-dermascan",
        description="Orquestrador de treinamento do DermaScan.",
    )

    parser.add_argument("--pasta-dataset", required=True)
    parser.add_argument("--pasta-imagens", default="")
    parser.add_argument("--arquivo-metadados", default="HAM10000_metadata.csv")
    parser.add_argument("--arquitetura", default="efficientnet_b3")
    parser.add_argument("--image-size", type=int, default=300)
    parser.add_argument("--batch-size", type=int, default=16)
    parser.add_argument("--epochs", type=int, default=1)
    parser.add_argument("--learning-rate", type=float, default=0.0001)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--criterio-selecao", default="recall_melanoma")
    parser.add_argument("--estrategia-balanceamento", default="pesos")
    parser.add_argument("--sem-validar-imagem", action="store_true")
    parser.add_argument("--real", action="store_false", dest="dry_run")
    parser.add_argument("--dry-run", action="store_true", dest="dry_run")
    parser.set_defaults(dry_run=True)

    return parser


def configuracao_de_argumentos(args: Any) -> ConfiguracaoExecucaoTreino:
    return criar_configuracao_execucao_treino(
        pasta_dataset=args.pasta_dataset,
        pasta_imagens=args.pasta_imagens,
        arquivo_metadados=args.arquivo_metadados,
        arquitetura=args.arquitetura,
        image_size=args.image_size,
        batch_size=args.batch_size,
        epochs=args.epochs,
        learning_rate=args.learning_rate,
        seed=args.seed,
        criterio_selecao=args.criterio_selecao,
        estrategia_balanceamento=args.estrategia_balanceamento,
        validar_arquivo_imagem=not args.sem_validar_imagem,
        dry_run=args.dry_run,
    )


def main(argv: Sequence[str] | None = None) -> int:
    parser = construir_parser()
    args = parser.parse_args(argv)
    configuracao = configuracao_de_argumentos(args)

    if configuracao.dry_run:
        resultado = executar_dry_run(configuracao)
    else:
        resultado = executar_treinamento_real(configuracao)

    print(
        json.dumps(
            resultado,
            ensure_ascii=False,
            indent=2,
        )
    )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())