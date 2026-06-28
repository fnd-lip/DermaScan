from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass, field
from typing import Any

CLASSES_PADRAO = (
    "akiec",
    "bcc",
    "bkl",
    "df",
    "mel",
    "nv",
    "vasc",
)

CLASSES_PRIORITARIAS_PADRAO = (
    "mel",
    "bcc",
    "akiec",
)

LIMIAR_PADRAO = 0.50

LIMIARES_PADRAO = {
    "akiec": 0.45,
    "bcc": 0.45,
    "bkl": 0.50,
    "df": 0.50,
    "mel": 0.35,
    "nv": 0.50,
    "vasc": 0.50,
}


@dataclass(frozen=True)
class ConfiguracaoLimiar:
    limiar_padrao: float = LIMIAR_PADRAO
    limiares_por_classe: dict[str, float] = field(
        default_factory=lambda: dict(LIMIARES_PADRAO)
    )
    classes_prioritarias: tuple[str, ...] = CLASSES_PRIORITARIAS_PADRAO


@dataclass(frozen=True)
class DecisaoLimiar:
    codigo: str
    probabilidade: float
    limiar: float
    atingiu_limiar: bool
    origem: str
    candidatos: list[dict[str, Any]] = field(default_factory=list)


def normalizar_codigo_classe(codigo: str) -> str:
    return codigo.strip().lower()


def validar_limiar(valor: Any) -> float:
    try:
        limiar = float(valor)
    except (TypeError, ValueError) as erro:
        raise ValueError("limiar inválido.") from erro

    if limiar < 0 or limiar > 1:
        raise ValueError("limiar inválido.")

    return limiar


def validar_probabilidade(valor: Any) -> float:
    try:
        probabilidade = float(valor)
    except (TypeError, ValueError) as erro:
        raise ValueError("probabilidade inválida.") from erro

    if probabilidade < 0 or probabilidade > 1:
        raise ValueError("probabilidade inválida.")

    return probabilidade


def validar_configuracao_limiar(
    configuracao: ConfiguracaoLimiar,
) -> ConfiguracaoLimiar:
    limiar_padrao = validar_limiar(configuracao.limiar_padrao)

    limiares: dict[str, float] = {}

    for codigo, limiar in configuracao.limiares_por_classe.items():
        codigo_normalizado = normalizar_codigo_classe(str(codigo))

        if not codigo_normalizado:
            raise ValueError("classe inválida.")

        limiares[codigo_normalizado] = validar_limiar(limiar)

    classes_prioritarias = tuple(
        normalizar_codigo_classe(str(codigo))
        for codigo in configuracao.classes_prioritarias
    )

    if any(not codigo for codigo in classes_prioritarias):
        raise ValueError("classe prioritária inválida.")

    return ConfiguracaoLimiar(
        limiar_padrao=limiar_padrao,
        limiares_por_classe=limiares,
        classes_prioritarias=classes_prioritarias,
    )


def criar_configuracao_limiar(
    limiar_padrao: float = LIMIAR_PADRAO,
    limiares_por_classe: Mapping[str, float] | None = None,
    classes_prioritarias: Sequence[str] = CLASSES_PRIORITARIAS_PADRAO,
) -> ConfiguracaoLimiar:
    configuracao = ConfiguracaoLimiar(
        limiar_padrao=limiar_padrao,
        limiares_por_classe=dict(limiares_por_classe or LIMIARES_PADRAO),
        classes_prioritarias=tuple(classes_prioritarias),
    )

    return validar_configuracao_limiar(configuracao)


def serializar_configuracao_limiar(
    configuracao: ConfiguracaoLimiar,
) -> dict[str, Any]:
    configuracao_validada = validar_configuracao_limiar(configuracao)

    return asdict(configuracao_validada)


def obter_limiar_classe(
    codigo: str,
    configuracao: ConfiguracaoLimiar | None = None,
) -> float:
    configuracao_validada = validar_configuracao_limiar(
        configuracao or ConfiguracaoLimiar()
    )

    codigo_normalizado = normalizar_codigo_classe(codigo)

    if not codigo_normalizado:
        raise ValueError("classe inválida.")

    return configuracao_validada.limiares_por_classe.get(
        codigo_normalizado,
        configuracao_validada.limiar_padrao,
    )


def extrair_probabilidade_item(item: Mapping[str, Any]) -> tuple[str, float]:
    codigo = item.get("codigo") or item.get("classe") or item.get("label")

    if codigo is None:
        raise ValueError("classe inválida.")

    if "probabilidade" in item:
        valor = item["probabilidade"]
    elif "confianca" in item:
        valor = item["confianca"]
    elif "prob" in item:
        valor = item["prob"]
    else:
        raise ValueError("probabilidade inválida.")

    return normalizar_codigo_classe(str(codigo)), validar_probabilidade(valor)


def normalizar_probabilidades(
    probabilidades: Mapping[str, Any] | Sequence[Mapping[str, Any]],
) -> dict[str, float]:
    resultado: dict[str, float] = {}

    if isinstance(probabilidades, Mapping):
        for codigo, valor in probabilidades.items():
            codigo_normalizado = normalizar_codigo_classe(str(codigo))

            if not codigo_normalizado:
                raise ValueError("classe inválida.")

            resultado[codigo_normalizado] = validar_probabilidade(valor)

    elif isinstance(probabilidades, Sequence) and not isinstance(
        probabilidades,
        str | bytes,
    ):
        for item in probabilidades:
            if not isinstance(item, Mapping):
                raise ValueError("probabilidades inválidas.")

            codigo_normalizado, probabilidade = extrair_probabilidade_item(item)

            if not codigo_normalizado:
                raise ValueError("classe inválida.")

            resultado[codigo_normalizado] = probabilidade

    else:
        raise ValueError("probabilidades inválidas.")

    if not resultado:
        raise ValueError("probabilidades vazias.")

    return resultado


def montar_candidatos_limiar(
    probabilidades: Mapping[str, Any] | Sequence[Mapping[str, Any]],
    configuracao: ConfiguracaoLimiar | None = None,
) -> list[dict[str, Any]]:
    probabilidades_normalizadas = normalizar_probabilidades(probabilidades)
    configuracao_validada = validar_configuracao_limiar(
        configuracao or ConfiguracaoLimiar()
    )

    candidatos = []

    for codigo, probabilidade in probabilidades_normalizadas.items():
        limiar = obter_limiar_classe(
            codigo,
            configuracao_validada,
        )

        atingiu_limiar = probabilidade >= limiar

        candidatos.append(
            {
                "codigo": codigo,
                "probabilidade": probabilidade,
                "limiar": limiar,
                "atingiu_limiar": atingiu_limiar,
                "prioritaria": codigo in configuracao_validada.classes_prioritarias,
            }
        )

    return sorted(
        candidatos,
        key=lambda item: (
            item["atingiu_limiar"],
            item["probabilidade"],
            item["prioritaria"],
        ),
        reverse=True,
    )


def decidir_por_limiar(
    probabilidades: Mapping[str, Any] | Sequence[Mapping[str, Any]],
    configuracao: ConfiguracaoLimiar | None = None,
) -> DecisaoLimiar:
    candidatos = montar_candidatos_limiar(
        probabilidades=probabilidades,
        configuracao=configuracao,
    )

    candidatos_acima_limiar = [
        candidato for candidato in candidatos if candidato["atingiu_limiar"]
    ]

    if candidatos_acima_limiar:
        escolhido = max(
            candidatos_acima_limiar,
            key=lambda item: (
                item["probabilidade"],
                item["prioritaria"],
            ),
        )

        origem = "limiar"
    else:
        escolhido = max(
            candidatos,
            key=lambda item: item["probabilidade"],
        )

        origem = "maior_probabilidade"

    return DecisaoLimiar(
        codigo=escolhido["codigo"],
        probabilidade=escolhido["probabilidade"],
        limiar=escolhido["limiar"],
        atingiu_limiar=escolhido["atingiu_limiar"],
        origem=origem,
        candidatos=candidatos,
    )


def identificar_alertas_limiar(
    probabilidades: Mapping[str, Any] | Sequence[Mapping[str, Any]],
    configuracao: ConfiguracaoLimiar | None = None,
) -> list[dict[str, Any]]:
    candidatos = montar_candidatos_limiar(
        probabilidades=probabilidades,
        configuracao=configuracao,
    )

    configuracao_validada = validar_configuracao_limiar(
        configuracao or ConfiguracaoLimiar()
    )

    alertas = [
        candidato
        for candidato in candidatos
        if candidato["prioritaria"]
        and candidato["atingiu_limiar"]
        and candidato["codigo"] in configuracao_validada.classes_prioritarias
    ]

    return sorted(
        alertas,
        key=lambda item: item["probabilidade"],
        reverse=True,
    )


def serializar_decisao_limiar(
    decisao: DecisaoLimiar,
) -> dict[str, Any]:
    if not isinstance(decisao, DecisaoLimiar):
        raise ValueError("decisão inválida.")

    return asdict(decisao)
