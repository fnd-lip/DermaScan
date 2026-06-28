from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass, field
import random
from typing import Any


ESTRATEGIA_NENHUMA = "nenhum"
ESTRATEGIA_PESOS = "pesos"
ESTRATEGIA_OVERSAMPLING = "oversampling"
ESTRATEGIA_SUBSAMPLING = "subsampling"

ESTRATEGIAS_SUPORTADAS = {
    ESTRATEGIA_NENHUMA,
    ESTRATEGIA_PESOS,
    ESTRATEGIA_OVERSAMPLING,
    ESTRATEGIA_SUBSAMPLING,
}

SEED_PADRAO = 42


@dataclass(frozen=True)
class ConfiguracaoBalanceamento:
    estrategia: str = ESTRATEGIA_PESOS
    campo_rotulo: str = "classe"
    seed: int = SEED_PADRAO
    limite_por_classe: int | None = None


@dataclass(frozen=True)
class ResultadoBalanceamento:
    itens: list[Any] = field(default_factory=list)
    contagem_original: dict[str, int] = field(default_factory=dict)
    contagem_balanceada: dict[str, int] = field(default_factory=dict)
    pesos_classes: dict[str, float] = field(default_factory=dict)
    configuracao: ConfiguracaoBalanceamento = field(
        default_factory=ConfiguracaoBalanceamento
    )


def normalizar_estrategia(estrategia: str) -> str:
    return estrategia.strip().lower()


def validar_estrategia(estrategia: str) -> str:
    estrategia_normalizada = normalizar_estrategia(estrategia)

    if estrategia_normalizada not in ESTRATEGIAS_SUPORTADAS:
        raise ValueError("estratégia inválida.")

    return estrategia_normalizada


def validar_quantidade_por_classe(valor: Any) -> int:
    try:
        quantidade = int(valor)
    except (TypeError, ValueError) as erro:
        raise ValueError("quantidade inválida.") from erro

    if quantidade <= 0:
        raise ValueError("quantidade inválida.")

    return quantidade


def validar_configuracao_balanceamento(
    configuracao: ConfiguracaoBalanceamento,
) -> ConfiguracaoBalanceamento:
    estrategia = validar_estrategia(configuracao.estrategia)
    campo_rotulo = configuracao.campo_rotulo.strip()

    if not campo_rotulo:
        raise ValueError("campo_rotulo inválido.")

    limite_por_classe = None

    if configuracao.limite_por_classe is not None:
        limite_por_classe = validar_quantidade_por_classe(
            configuracao.limite_por_classe
        )

    return ConfiguracaoBalanceamento(
        estrategia=estrategia,
        campo_rotulo=campo_rotulo,
        seed=int(configuracao.seed),
        limite_por_classe=limite_por_classe,
    )


def criar_configuracao_balanceamento(
    estrategia: str = ESTRATEGIA_PESOS,
    campo_rotulo: str = "classe",
    seed: int = SEED_PADRAO,
    limite_por_classe: int | None = None,
) -> ConfiguracaoBalanceamento:
    configuracao = ConfiguracaoBalanceamento(
        estrategia=estrategia,
        campo_rotulo=campo_rotulo,
        seed=seed,
        limite_por_classe=limite_por_classe,
    )

    return validar_configuracao_balanceamento(configuracao)


def serializar_configuracao_balanceamento(
    configuracao: ConfiguracaoBalanceamento,
) -> dict[str, Any]:
    configuracao_validada = validar_configuracao_balanceamento(configuracao)

    return asdict(configuracao_validada)


def extrair_rotulo_item(
    item: Any,
    campo_rotulo: str,
) -> str:
    if isinstance(item, Mapping):
        valor = item.get(campo_rotulo)

        if valor is None:
            raise ValueError("rótulo inválido.")

        return str(valor)

    if hasattr(item, campo_rotulo):
        valor = getattr(item, campo_rotulo)

        if valor is None:
            raise ValueError("rótulo inválido.")

        return str(valor)

    raise ValueError("rótulo inválido.")


def agrupar_por_classe(
    itens: Sequence[Any],
    campo_rotulo: str = "classe",
) -> dict[str, list[Any]]:
    campo = campo_rotulo.strip()

    if not campo:
        raise ValueError("campo_rotulo inválido.")

    grupos: dict[str, list[Any]] = {}

    for item in itens:
        rotulo = extrair_rotulo_item(
            item=item,
            campo_rotulo=campo,
        ).strip()

        if not rotulo:
            raise ValueError("rótulo inválido.")

        grupos.setdefault(rotulo, []).append(item)

    return grupos


def contar_classes(
    itens: Sequence[Any],
    campo_rotulo: str = "classe",
) -> dict[str, int]:
    grupos = agrupar_por_classe(
        itens=itens,
        campo_rotulo=campo_rotulo,
    )

    return {
        classe: len(valores)
        for classe, valores in sorted(grupos.items())
    }


def validar_contagens_classes(
    contagens: Mapping[str, Any],
) -> dict[str, int]:
    if not isinstance(contagens, Mapping):
        raise ValueError("contagens inválidas.")

    if len(contagens) == 0:
        raise ValueError("contagens vazias.")

    resultado: dict[str, int] = {}

    for classe, quantidade in contagens.items():
        classe_normalizada = str(classe).strip()

        if not classe_normalizada:
            raise ValueError("classe inválida.")

        quantidade_validada = validar_quantidade_por_classe(quantidade)
        resultado[classe_normalizada] = quantidade_validada

    return resultado


def calcular_pesos_classes(
    contagens: Mapping[str, Any],
) -> dict[str, float]:
    contagens_validas = validar_contagens_classes(contagens)

    total = sum(contagens_validas.values())
    quantidade_classes = len(contagens_validas)

    return {
        classe: total / (quantidade_classes * quantidade)
        for classe, quantidade in sorted(contagens_validas.items())
    }


def calcular_pesos_itens(
    itens: Sequence[Any],
    campo_rotulo: str = "classe",
) -> list[float]:
    contagens = contar_classes(
        itens=itens,
        campo_rotulo=campo_rotulo,
    )

    pesos_classes = calcular_pesos_classes(contagens)

    return [
        pesos_classes[
            extrair_rotulo_item(
                item=item,
                campo_rotulo=campo_rotulo,
            )
        ]
        for item in itens
    ]


def embaralhar_reprodutivel(
    itens: Sequence[Any],
    seed: int = SEED_PADRAO,
) -> list[Any]:
    itens_embaralhados = list(itens)
    gerador = random.Random(seed)
    gerador.shuffle(itens_embaralhados)

    return itens_embaralhados


def expandir_classe_com_reposicao(
    itens: Sequence[Any],
    quantidade_alvo: int,
    seed: int = SEED_PADRAO,
) -> list[Any]:
    itens_base = list(itens)

    if not itens_base:
        raise ValueError("itens vazios.")

    quantidade = validar_quantidade_por_classe(quantidade_alvo)

    if quantidade < len(itens_base):
        raise ValueError("quantidade inválida.")

    resultado = list(itens_base)
    gerador = random.Random(seed)

    while len(resultado) < quantidade:
        resultado.append(gerador.choice(itens_base))

    return resultado


def reduzir_classe_sem_reposicao(
    itens: Sequence[Any],
    quantidade_alvo: int,
    seed: int = SEED_PADRAO,
) -> list[Any]:
    itens_base = list(itens)

    if not itens_base:
        raise ValueError("itens vazios.")

    quantidade = validar_quantidade_por_classe(quantidade_alvo)

    if quantidade > len(itens_base):
        raise ValueError("quantidade inválida.")

    return embaralhar_reprodutivel(
        itens=itens_base,
        seed=seed,
    )[:quantidade]


def obter_quantidade_alvo_oversampling(
    grupos: Mapping[str, Sequence[Any]],
    limite_por_classe: int | None = None,
) -> int:
    tamanhos = [len(valores) for valores in grupos.values()]

    if not tamanhos:
        raise ValueError("grupos vazios.")

    quantidade_alvo = limite_por_classe or max(tamanhos)
    quantidade_validada = validar_quantidade_por_classe(quantidade_alvo)

    if quantidade_validada < max(tamanhos):
        raise ValueError("quantidade inválida.")

    return quantidade_validada


def obter_quantidade_alvo_subsampling(
    grupos: Mapping[str, Sequence[Any]],
    limite_por_classe: int | None = None,
) -> int:
    tamanhos = [len(valores) for valores in grupos.values()]

    if not tamanhos:
        raise ValueError("grupos vazios.")

    quantidade_alvo = limite_por_classe or min(tamanhos)
    quantidade_validada = validar_quantidade_por_classe(quantidade_alvo)

    if quantidade_validada > min(tamanhos):
        raise ValueError("quantidade inválida.")

    return quantidade_validada


def balancear_oversampling(
    itens: Sequence[Any],
    campo_rotulo: str = "classe",
    seed: int = SEED_PADRAO,
    limite_por_classe: int | None = None,
) -> list[Any]:
    grupos = agrupar_por_classe(
        itens=itens,
        campo_rotulo=campo_rotulo,
    )

    if not grupos:
        raise ValueError("itens vazios.")

    quantidade_alvo = obter_quantidade_alvo_oversampling(
        grupos=grupos,
        limite_por_classe=limite_por_classe,
    )

    resultado: list[Any] = []

    for indice, classe in enumerate(sorted(grupos.keys())):
        resultado.extend(
            expandir_classe_com_reposicao(
                itens=grupos[classe],
                quantidade_alvo=quantidade_alvo,
                seed=seed + indice,
            )
        )

    return embaralhar_reprodutivel(
        itens=resultado,
        seed=seed,
    )


def balancear_subsampling(
    itens: Sequence[Any],
    campo_rotulo: str = "classe",
    seed: int = SEED_PADRAO,
    limite_por_classe: int | None = None,
) -> list[Any]:
    grupos = agrupar_por_classe(
        itens=itens,
        campo_rotulo=campo_rotulo,
    )

    if not grupos:
        raise ValueError("itens vazios.")

    quantidade_alvo = obter_quantidade_alvo_subsampling(
        grupos=grupos,
        limite_por_classe=limite_por_classe,
    )

    resultado: list[Any] = []

    for indice, classe in enumerate(sorted(grupos.keys())):
        resultado.extend(
            reduzir_classe_sem_reposicao(
                itens=grupos[classe],
                quantidade_alvo=quantidade_alvo,
                seed=seed + indice,
            )
        )

    return embaralhar_reprodutivel(
        itens=resultado,
        seed=seed,
    )


def balancear_dataset(
    itens: Sequence[Any],
    configuracao: ConfiguracaoBalanceamento | None = None,
) -> list[Any]:
    configuracao_validada = validar_configuracao_balanceamento(
        configuracao or ConfiguracaoBalanceamento()
    )

    if len(itens) == 0:
        raise ValueError("itens vazios.")

    if configuracao_validada.estrategia in {
        ESTRATEGIA_NENHUMA,
        ESTRATEGIA_PESOS,
    }:
        return list(itens)

    if configuracao_validada.estrategia == ESTRATEGIA_OVERSAMPLING:
        return balancear_oversampling(
            itens=itens,
            campo_rotulo=configuracao_validada.campo_rotulo,
            seed=configuracao_validada.seed,
            limite_por_classe=configuracao_validada.limite_por_classe,
        )

    if configuracao_validada.estrategia == ESTRATEGIA_SUBSAMPLING:
        return balancear_subsampling(
            itens=itens,
            campo_rotulo=configuracao_validada.campo_rotulo,
            seed=configuracao_validada.seed,
            limite_por_classe=configuracao_validada.limite_por_classe,
        )

    raise ValueError("estratégia inválida.")


def aplicar_balanceamento(
    itens: Sequence[Any],
    configuracao: ConfiguracaoBalanceamento | None = None,
) -> ResultadoBalanceamento:
    configuracao_validada = validar_configuracao_balanceamento(
        configuracao or ConfiguracaoBalanceamento()
    )

    if len(itens) == 0:
        raise ValueError("itens vazios.")

    contagem_original = contar_classes(
        itens=itens,
        campo_rotulo=configuracao_validada.campo_rotulo,
    )

    itens_balanceados = balancear_dataset(
        itens=itens,
        configuracao=configuracao_validada,
    )

    contagem_balanceada = contar_classes(
        itens=itens_balanceados,
        campo_rotulo=configuracao_validada.campo_rotulo,
    )

    pesos_classes = calcular_pesos_classes(contagem_original)

    return ResultadoBalanceamento(
        itens=itens_balanceados,
        contagem_original=contagem_original,
        contagem_balanceada=contagem_balanceada,
        pesos_classes=pesos_classes,
        configuracao=configuracao_validada,
    )


def validar_resultado_balanceamento(
    resultado: ResultadoBalanceamento,
) -> ResultadoBalanceamento:
    if not isinstance(resultado, ResultadoBalanceamento):
        raise ValueError("resultado inválido.")

    validar_configuracao_balanceamento(resultado.configuracao)

    if not resultado.itens:
        raise ValueError("resultado vazio.")

    validar_contagens_classes(resultado.contagem_original)
    validar_contagens_classes(resultado.contagem_balanceada)

    if not resultado.pesos_classes:
        raise ValueError("pesos inválidos.")

    return resultado


def resumir_balanceamento(
    resultado: ResultadoBalanceamento,
) -> dict[str, Any]:
    resultado_validado = validar_resultado_balanceamento(resultado)

    return {
        "total_original": sum(resultado_validado.contagem_original.values()),
        "total_balanceado": sum(resultado_validado.contagem_balanceada.values()),
        "contagem_original": dict(resultado_validado.contagem_original),
        "contagem_balanceada": dict(resultado_validado.contagem_balanceada),
        "pesos_classes": dict(resultado_validado.pesos_classes),
        "configuracao": serializar_configuracao_balanceamento(
            resultado_validado.configuracao
        ),
    }