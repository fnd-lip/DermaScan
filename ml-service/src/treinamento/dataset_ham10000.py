from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass, field
from pathlib import Path
import csv
from typing import Any


CLASSES_HAM10000 = (
    "akiec",
    "bcc",
    "bkl",
    "df",
    "mel",
    "nv",
    "vasc",
)

EXTENSOES_IMAGEM_PADRAO = (
    ".jpg",
    ".jpeg",
    ".png",
)

COLUNAS_OBRIGATORIAS_HAM10000 = (
    "image_id",
    "dx",
)

PASTAS_IMAGEM_PADRAO = (
    "HAM10000_images_part_1",
    "HAM10000_images_part_2",
    "images",
)


@dataclass(frozen=True)
class ConfiguracaoDatasetHAM10000:
    pasta_dataset: str = ""
    pasta_imagens: str = ""
    arquivo_metadados: str = "HAM10000_metadata.csv"
    campo_imagem: str = "image_id"
    campo_classe: str = "dx"
    classes_validas: tuple[str, ...] = CLASSES_HAM10000
    extensoes_imagem: tuple[str, ...] = EXTENSOES_IMAGEM_PADRAO
    validar_arquivo_imagem: bool = True


@dataclass(frozen=True)
class RegistroHAM10000:
    image_id: str
    classe: str
    caminho_imagem: str | None = None
    metadados: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class ResultadoDatasetHAM10000:
    registros: list[RegistroHAM10000] = field(default_factory=list)
    configuracao: ConfiguracaoDatasetHAM10000 = field(
        default_factory=ConfiguracaoDatasetHAM10000
    )


def normalizar_texto(valor: Any) -> str:
    if valor is None:
        return ""

    return str(valor).strip()


def normalizar_classe(classe: Any) -> str:
    return normalizar_texto(classe).lower()


def validar_classe_ham10000(
    classe: Any,
    classes_validas: Sequence[str] = CLASSES_HAM10000,
) -> str:
    classe_normalizada = normalizar_classe(classe)
    classes_normalizadas = tuple(
        normalizar_classe(classe_valida)
        for classe_valida in classes_validas
    )

    if not classe_normalizada:
        raise ValueError("classe inválida.")

    if classe_normalizada not in classes_normalizadas:
        raise ValueError("classe inválida.")

    return classe_normalizada


def normalizar_extensao(extensao: Any) -> str:
    extensao_normalizada = normalizar_texto(extensao).lower()

    if not extensao_normalizada:
        raise ValueError("extensão inválida.")

    if not extensao_normalizada.startswith("."):
        extensao_normalizada = f".{extensao_normalizada}"

    return extensao_normalizada


def validar_configuracao_dataset_ham10000(
    configuracao: ConfiguracaoDatasetHAM10000,
) -> ConfiguracaoDatasetHAM10000:
    campo_imagem = configuracao.campo_imagem.strip()
    campo_classe = configuracao.campo_classe.strip()
    arquivo_metadados = configuracao.arquivo_metadados.strip()

    if not campo_imagem:
        raise ValueError("campo_imagem inválido.")

    if not campo_classe:
        raise ValueError("campo_classe inválido.")

    if not arquivo_metadados:
        raise ValueError("arquivo_metadados inválido.")

    classes_validas = tuple(
        normalizar_classe(classe)
        for classe in configuracao.classes_validas
    )

    if not classes_validas or any(not classe for classe in classes_validas):
        raise ValueError("classes_validas inválidas.")

    extensoes_imagem = tuple(
        normalizar_extensao(extensao)
        for extensao in configuracao.extensoes_imagem
    )

    if not extensoes_imagem:
        raise ValueError("extensoes_imagem inválidas.")

    return ConfiguracaoDatasetHAM10000(
        pasta_dataset=configuracao.pasta_dataset.strip(),
        pasta_imagens=configuracao.pasta_imagens.strip(),
        arquivo_metadados=arquivo_metadados,
        campo_imagem=campo_imagem,
        campo_classe=campo_classe,
        classes_validas=classes_validas,
        extensoes_imagem=extensoes_imagem,
        validar_arquivo_imagem=bool(configuracao.validar_arquivo_imagem),
    )


def criar_configuracao_dataset_ham10000(
    pasta_dataset: str = "",
    pasta_imagens: str = "",
    arquivo_metadados: str = "HAM10000_metadata.csv",
    campo_imagem: str = "image_id",
    campo_classe: str = "dx",
    classes_validas: Sequence[str] = CLASSES_HAM10000,
    extensoes_imagem: Sequence[str] = EXTENSOES_IMAGEM_PADRAO,
    validar_arquivo_imagem: bool = True,
) -> ConfiguracaoDatasetHAM10000:
    configuracao = ConfiguracaoDatasetHAM10000(
        pasta_dataset=pasta_dataset,
        pasta_imagens=pasta_imagens,
        arquivo_metadados=arquivo_metadados,
        campo_imagem=campo_imagem,
        campo_classe=campo_classe,
        classes_validas=tuple(classes_validas),
        extensoes_imagem=tuple(extensoes_imagem),
        validar_arquivo_imagem=validar_arquivo_imagem,
    )

    return validar_configuracao_dataset_ham10000(configuracao)


def serializar_configuracao_dataset_ham10000(
    configuracao: ConfiguracaoDatasetHAM10000,
) -> dict[str, Any]:
    configuracao_validada = validar_configuracao_dataset_ham10000(configuracao)

    return asdict(configuracao_validada)


def resolver_caminho_metadados(
    configuracao: ConfiguracaoDatasetHAM10000,
) -> Path:
    configuracao_validada = validar_configuracao_dataset_ham10000(configuracao)
    caminho = Path(configuracao_validada.arquivo_metadados)

    if caminho.is_absolute():
        return caminho

    return Path(configuracao_validada.pasta_dataset) / caminho


def obter_pasta_imagens(
    configuracao: ConfiguracaoDatasetHAM10000,
) -> Path:
    configuracao_validada = validar_configuracao_dataset_ham10000(configuracao)

    if not configuracao_validada.pasta_imagens:
        return Path(configuracao_validada.pasta_dataset)

    caminho_imagens = Path(configuracao_validada.pasta_imagens)

    if caminho_imagens.is_absolute():
        return caminho_imagens

    return Path(configuracao_validada.pasta_dataset) / caminho_imagens


def gerar_nomes_arquivo_imagem(
    image_id: Any,
    extensoes: Sequence[str] = EXTENSOES_IMAGEM_PADRAO,
) -> list[str]:
    image_id_normalizado = normalizar_texto(image_id)

    if not image_id_normalizado:
        raise ValueError("image_id inválido.")

    caminho = Path(image_id_normalizado)

    if caminho.suffix:
        return [image_id_normalizado]

    return [
        f"{image_id_normalizado}{normalizar_extensao(extensao)}"
        for extensao in extensoes
    ]


def montar_candidatos_imagem(
    image_id: Any,
    configuracao: ConfiguracaoDatasetHAM10000,
) -> list[Path]:
    configuracao_validada = validar_configuracao_dataset_ham10000(configuracao)
    pasta_base = obter_pasta_imagens(configuracao_validada)
    nomes = gerar_nomes_arquivo_imagem(
        image_id=image_id,
        extensoes=configuracao_validada.extensoes_imagem,
    )

    candidatos: list[Path] = []

    for nome in nomes:
        caminho_nome = Path(nome)

        if caminho_nome.is_absolute():
            candidatos.append(caminho_nome)
            continue

        candidatos.append(pasta_base / caminho_nome)

        for pasta in PASTAS_IMAGEM_PADRAO:
            candidatos.append(pasta_base / pasta / caminho_nome)

    return candidatos


def resolver_caminho_imagem(
    image_id: Any,
    configuracao: ConfiguracaoDatasetHAM10000,
) -> str:
    configuracao_validada = validar_configuracao_dataset_ham10000(configuracao)
    candidatos = montar_candidatos_imagem(
        image_id=image_id,
        configuracao=configuracao_validada,
    )

    for candidato in candidatos:
        if candidato.exists():
            return str(candidato)

    if not configuracao_validada.validar_arquivo_imagem:
        return str(candidatos[0])

    raise ValueError("imagem não encontrada.")


def validar_colunas_metadados(
    colunas: Sequence[str] | None,
    campos_obrigatorios: Sequence[str] = COLUNAS_OBRIGATORIAS_HAM10000,
) -> tuple[str, ...]:
    if not colunas:
        raise ValueError("metadados inválidos.")

    colunas_normalizadas = tuple(str(coluna).strip() for coluna in colunas)

    for campo in campos_obrigatorios:
        if campo not in colunas_normalizadas:
            raise ValueError("metadados incompletos.")

    return colunas_normalizadas


def ler_metadados_csv(
    caminho_metadados: str | Path,
    campos_obrigatorios: Sequence[str] = COLUNAS_OBRIGATORIAS_HAM10000,
) -> list[dict[str, str]]:
    caminho = Path(caminho_metadados)

    if not caminho.exists():
        raise ValueError("arquivo de metadados não encontrado.")

    with caminho.open("r", encoding="utf-8-sig", newline="") as arquivo:
        leitor = csv.DictReader(arquivo)
        validar_colunas_metadados(
            colunas=leitor.fieldnames,
            campos_obrigatorios=campos_obrigatorios,
        )
        linhas = [dict(linha) for linha in leitor]

    if not linhas:
        raise ValueError("metadados vazios.")

    return linhas


def extrair_campo_linha(
    linha: Mapping[str, Any],
    campo: str,
) -> str:
    if not isinstance(linha, Mapping):
        raise ValueError("linha inválida.")

    valor = linha.get(campo)

    if valor is None:
        raise ValueError("linha incompleta.")

    valor_normalizado = normalizar_texto(valor)

    if not valor_normalizado:
        raise ValueError("linha incompleta.")

    return valor_normalizado


def criar_registro_ham10000(
    linha: Mapping[str, Any],
    configuracao: ConfiguracaoDatasetHAM10000 | None = None,
) -> RegistroHAM10000:
    configuracao_validada = validar_configuracao_dataset_ham10000(
        configuracao or ConfiguracaoDatasetHAM10000()
    )

    image_id = extrair_campo_linha(
        linha=linha,
        campo=configuracao_validada.campo_imagem,
    )

    classe = validar_classe_ham10000(
        extrair_campo_linha(
            linha=linha,
            campo=configuracao_validada.campo_classe,
        ),
        classes_validas=configuracao_validada.classes_validas,
    )

    caminho_imagem = resolver_caminho_imagem(
        image_id=image_id,
        configuracao=configuracao_validada,
    )

    return RegistroHAM10000(
        image_id=image_id,
        classe=classe,
        caminho_imagem=caminho_imagem,
        metadados=dict(linha),
    )


def carregar_dataset_ham10000(
    configuracao: ConfiguracaoDatasetHAM10000 | None = None,
) -> ResultadoDatasetHAM10000:
    configuracao_validada = validar_configuracao_dataset_ham10000(
        configuracao or ConfiguracaoDatasetHAM10000()
    )

    caminho_metadados = resolver_caminho_metadados(configuracao_validada)

    linhas = ler_metadados_csv(
        caminho_metadados=caminho_metadados,
        campos_obrigatorios=(
            configuracao_validada.campo_imagem,
            configuracao_validada.campo_classe,
        ),
    )

    registros = [
        criar_registro_ham10000(
            linha=linha,
            configuracao=configuracao_validada,
        )
        for linha in linhas
    ]

    return ResultadoDatasetHAM10000(
        registros=registros,
        configuracao=configuracao_validada,
    )


def validar_registro_ham10000(
    registro: RegistroHAM10000,
) -> RegistroHAM10000:
    if not isinstance(registro, RegistroHAM10000):
        raise ValueError("registro inválido.")

    if not registro.image_id.strip():
        raise ValueError("image_id inválido.")

    validar_classe_ham10000(registro.classe)

    if registro.caminho_imagem is not None and not registro.caminho_imagem.strip():
        raise ValueError("caminho_imagem inválido.")

    return registro


def contar_classes_ham10000(
    registros: Sequence[RegistroHAM10000],
) -> dict[str, int]:
    contagem: dict[str, int] = {}

    for registro in registros:
        registro_validado = validar_registro_ham10000(registro)
        contagem[registro_validado.classe] = contagem.get(
            registro_validado.classe,
            0,
        ) + 1

    return {
        classe: contagem[classe]
        for classe in sorted(contagem.keys())
    }


def filtrar_registros_por_classe(
    registros: Sequence[RegistroHAM10000],
    classe: str,
) -> list[RegistroHAM10000]:
    classe_validada = validar_classe_ham10000(classe)

    return [
        registro
        for registro in registros
        if validar_registro_ham10000(registro).classe == classe_validada
    ]


def obter_rotulos_ham10000(
    registros: Sequence[RegistroHAM10000],
) -> list[str]:
    return [
        validar_registro_ham10000(registro).classe
        for registro in registros
    ]


def converter_registro_para_item_treinamento(
    registro: RegistroHAM10000,
) -> dict[str, Any]:
    registro_validado = validar_registro_ham10000(registro)

    return {
        "id": registro_validado.image_id,
        "classe": registro_validado.classe,
        "caminho_imagem": registro_validado.caminho_imagem,
        "metadados": dict(registro_validado.metadados),
    }


def preparar_itens_treinamento_ham10000(
    registros: Sequence[RegistroHAM10000],
) -> list[dict[str, Any]]:
    if not registros:
        raise ValueError("registros vazios.")

    return [
        converter_registro_para_item_treinamento(registro)
        for registro in registros
    ]


def validar_resultado_dataset_ham10000(
    resultado: ResultadoDatasetHAM10000,
) -> ResultadoDatasetHAM10000:
    if not isinstance(resultado, ResultadoDatasetHAM10000):
        raise ValueError("resultado inválido.")

    validar_configuracao_dataset_ham10000(resultado.configuracao)

    if not resultado.registros:
        raise ValueError("registros vazios.")

    for registro in resultado.registros:
        validar_registro_ham10000(registro)

    return resultado


def resumir_dataset_ham10000(
    resultado: ResultadoDatasetHAM10000,
) -> dict[str, Any]:
    resultado_validado = validar_resultado_dataset_ham10000(resultado)
    contagem_classes = contar_classes_ham10000(resultado_validado.registros)

    return {
        "total": len(resultado_validado.registros),
        "classes": contagem_classes,
        "classes_presentes": sorted(contagem_classes.keys()),
        "imagens_com_caminho": sum(
            1
            for registro in resultado_validado.registros
            if registro.caminho_imagem
        ),
        "configuracao": serializar_configuracao_dataset_ham10000(
            resultado_validado.configuracao
        ),
    }