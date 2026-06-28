from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass, field
import random
from typing import Any

PROPORCAO_TREINO_PADRAO = 0.70
PROPORCAO_VALIDACAO_PADRAO = 0.15
PROPORCAO_TESTE_PADRAO = 0.15
SEED_PADRAO = 42


@dataclass(frozen=True)
class ConfiguracaoSplit:
    proporcao_treino: float = PROPORCAO_TREINO_PADRAO
    proporcao_validacao: float = PROPORCAO_VALIDACAO_PADRAO
    proporcao_teste: float = PROPORCAO_TESTE_PADRAO
    seed: int = SEED_PADRAO
    estratificar: bool = True
    campo_rotulo: str = "classe"


@dataclass(frozen=True)
class ResultadoSplit:
    treino: list[Any] = field(default_factory=list)
    validacao: list[Any] = field(default_factory=list)
    teste: list[Any] = field(default_factory=list)
    configuracao: ConfiguracaoSplit = field(default_factory=ConfiguracaoSplit)


def validar_proporcao(valor: Any) -> float:
    try:
        proporcao = float(valor)
    except (TypeError, ValueError) as erro:
        raise ValueError("proporção inválida.") from erro

    if proporcao < 0 or proporcao > 1:
        raise ValueError("proporção inválida.")

    return proporcao


def validar_configuracao_split(
    configuracao: ConfiguracaoSplit,
) -> ConfiguracaoSplit:
    proporcao_treino = validar_proporcao(configuracao.proporcao_treino)
    proporcao_validacao = validar_proporcao(configuracao.proporcao_validacao)
    proporcao_teste = validar_proporcao(configuracao.proporcao_teste)

    soma = proporcao_treino + proporcao_validacao + proporcao_teste

    if round(soma, 10) != 1:
        raise ValueError("proporções inválidas.")

    if proporcao_treino <= 0:
        raise ValueError("proporção de treino inválida.")

    if proporcao_validacao <= 0:
        raise ValueError("proporção de validação inválida.")

    if proporcao_teste <= 0:
        raise ValueError("proporção de teste inválida.")

    campo_rotulo = configuracao.campo_rotulo.strip()

    if not campo_rotulo:
        raise ValueError("campo_rotulo inválido.")

    return ConfiguracaoSplit(
        proporcao_treino=proporcao_treino,
        proporcao_validacao=proporcao_validacao,
        proporcao_teste=proporcao_teste,
        seed=int(configuracao.seed),
        estratificar=bool(configuracao.estratificar),
        campo_rotulo=campo_rotulo,
    )


def criar_configuracao_split(
    proporcao_treino: float = PROPORCAO_TREINO_PADRAO,
    proporcao_validacao: float = PROPORCAO_VALIDACAO_PADRAO,
    proporcao_teste: float = PROPORCAO_TESTE_PADRAO,
    seed: int = SEED_PADRAO,
    estratificar: bool = True,
    campo_rotulo: str = "classe",
) -> ConfiguracaoSplit:
    configuracao = ConfiguracaoSplit(
        proporcao_treino=proporcao_treino,
        proporcao_validacao=proporcao_validacao,
        proporcao_teste=proporcao_teste,
        seed=seed,
        estratificar=estratificar,
        campo_rotulo=campo_rotulo,
    )

    return validar_configuracao_split(configuracao)


def serializar_configuracao_split(
    configuracao: ConfiguracaoSplit,
) -> dict[str, Any]:
    configuracao_validada = validar_configuracao_split(configuracao)

    return asdict(configuracao_validada)


def embaralhar_reprodutivel(
    itens: Sequence[Any],
    seed: int = SEED_PADRAO,
) -> list[Any]:
    itens_embaralhados = list(itens)
    gerador = random.Random(seed)
    gerador.shuffle(itens_embaralhados)

    return itens_embaralhados


def calcular_tamanhos_split(
    quantidade: int,
    configuracao: ConfiguracaoSplit | None = None,
) -> dict[str, int]:
    if quantidade < 0:
        raise ValueError("quantidade inválida.")

    configuracao_validada = validar_configuracao_split(
        configuracao or ConfiguracaoSplit()
    )

    tamanho_treino = int(quantidade * configuracao_validada.proporcao_treino)
    tamanho_validacao = int(quantidade * configuracao_validada.proporcao_validacao)

    tamanho_teste = quantidade - tamanho_treino - tamanho_validacao

    return {
        "treino": tamanho_treino,
        "validacao": tamanho_validacao,
        "teste": tamanho_teste,
    }


def dividir_lista(
    itens: Sequence[Any],
    configuracao: ConfiguracaoSplit | None = None,
) -> ResultadoSplit:
    configuracao_validada = validar_configuracao_split(
        configuracao or ConfiguracaoSplit()
    )

    itens_embaralhados = embaralhar_reprodutivel(
        itens=itens,
        seed=configuracao_validada.seed,
    )

    tamanhos = calcular_tamanhos_split(
        quantidade=len(itens_embaralhados),
        configuracao=configuracao_validada,
    )

    fim_treino = tamanhos["treino"]
    fim_validacao = fim_treino + tamanhos["validacao"]

    return ResultadoSplit(
        treino=itens_embaralhados[:fim_treino],
        validacao=itens_embaralhados[fim_treino:fim_validacao],
        teste=itens_embaralhados[fim_validacao:],
        configuracao=configuracao_validada,
    )


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


def agrupar_por_rotulo(
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
        )

        if not rotulo:
            raise ValueError("rótulo inválido.")

        grupos.setdefault(rotulo, []).append(item)

    return grupos


def dividir_lista_estratificada(
    itens: Sequence[Any],
    configuracao: ConfiguracaoSplit | None = None,
) -> ResultadoSplit:
    configuracao_validada = validar_configuracao_split(
        configuracao or ConfiguracaoSplit()
    )

    grupos = agrupar_por_rotulo(
        itens=itens,
        campo_rotulo=configuracao_validada.campo_rotulo,
    )

    treino: list[Any] = []
    validacao: list[Any] = []
    teste: list[Any] = []

    for indice, rotulo in enumerate(sorted(grupos.keys())):
        itens_grupo = grupos[rotulo]

        resultado_grupo = dividir_lista(
            itens=itens_grupo,
            configuracao=ConfiguracaoSplit(
                proporcao_treino=configuracao_validada.proporcao_treino,
                proporcao_validacao=configuracao_validada.proporcao_validacao,
                proporcao_teste=configuracao_validada.proporcao_teste,
                seed=configuracao_validada.seed + indice,
                estratificar=False,
                campo_rotulo=configuracao_validada.campo_rotulo,
            ),
        )

        treino.extend(resultado_grupo.treino)
        validacao.extend(resultado_grupo.validacao)
        teste.extend(resultado_grupo.teste)

    return ResultadoSplit(
        treino=embaralhar_reprodutivel(
            treino,
            seed=configuracao_validada.seed,
        ),
        validacao=embaralhar_reprodutivel(
            validacao,
            seed=configuracao_validada.seed + 1,
        ),
        teste=embaralhar_reprodutivel(
            teste,
            seed=configuracao_validada.seed + 2,
        ),
        configuracao=configuracao_validada,
    )


def dividir_dataset(
    itens: Sequence[Any],
    configuracao: ConfiguracaoSplit | None = None,
) -> ResultadoSplit:
    configuracao_validada = validar_configuracao_split(
        configuracao or ConfiguracaoSplit()
    )

    if len(itens) == 0:
        raise ValueError("itens vazios.")

    if configuracao_validada.estratificar:
        return dividir_lista_estratificada(
            itens=itens,
            configuracao=configuracao_validada,
        )

    return dividir_lista(
        itens=itens,
        configuracao=configuracao_validada,
    )


def contar_por_rotulo(
    itens: Sequence[Any],
    campo_rotulo: str = "classe",
) -> dict[str, int]:
    grupos = agrupar_por_rotulo(
        itens=itens,
        campo_rotulo=campo_rotulo,
    )

    return {rotulo: len(valores) for rotulo, valores in sorted(grupos.items())}


def validar_resultado_split(
    resultado: ResultadoSplit,
) -> ResultadoSplit:
    if not isinstance(resultado, ResultadoSplit):
        raise ValueError("resultado inválido.")

    validar_configuracao_split(resultado.configuracao)

    total = len(resultado.treino) + len(resultado.validacao) + len(resultado.teste)

    if total == 0:
        raise ValueError("resultado vazio.")

    return resultado


def resumir_split(
    resultado: ResultadoSplit,
) -> dict[str, Any]:
    resultado_validado = validar_resultado_split(resultado)

    resumo = {
        "treino": len(resultado_validado.treino),
        "validacao": len(resultado_validado.validacao),
        "teste": len(resultado_validado.teste),
        "total": (
            len(resultado_validado.treino)
            + len(resultado_validado.validacao)
            + len(resultado_validado.teste)
        ),
        "configuracao": serializar_configuracao_split(resultado_validado.configuracao),
    }

    if resultado_validado.configuracao.estratificar:
        campo_rotulo = resultado_validado.configuracao.campo_rotulo

        resumo["rotulos"] = {
            "treino": contar_por_rotulo(
                resultado_validado.treino,
                campo_rotulo=campo_rotulo,
            ),
            "validacao": contar_por_rotulo(
                resultado_validado.validacao,
                campo_rotulo=campo_rotulo,
            ),
            "teste": contar_por_rotulo(
                resultado_validado.teste,
                campo_rotulo=campo_rotulo,
            ),
        }

    return resumo
