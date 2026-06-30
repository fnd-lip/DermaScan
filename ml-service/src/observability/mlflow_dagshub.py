from dataclasses import dataclass
import os


URI_BASE_DAGSHUB = "https://dagshub.com"
EXPERIMENTO_PADRAO = "dermascan-classificacao-lesoes"


@dataclass(frozen=True)
class ConfiguracaoMLflowDagsHub:
    usuario: str = ""
    repositorio: str = ""
    experimento: str = EXPERIMENTO_PADRAO
    tracking_uri: str = ""

    def uri_final(self) -> str:
        if self.tracking_uri:
            return self.tracking_uri

        if not self.usuario:
            raise ValueError("Informe o usuário do DagsHub em DAGSHUB_USER.")

        if not self.repositorio:
            raise ValueError("Informe o repositório do DagsHub em DAGSHUB_REPO.")

        return montar_tracking_uri_dagshub(
            usuario=self.usuario,
            repositorio=self.repositorio,
        )


def normalizar_parte_uri(valor: str, nome_campo: str) -> str:
    valor_normalizado = valor.strip().strip("/")

    if not valor_normalizado:
        raise ValueError(f"O campo {nome_campo} não pode ficar vazio.")

    if " " in valor_normalizado:
        raise ValueError(f"O campo {nome_campo} não deve conter espaços.")

    return valor_normalizado


def montar_tracking_uri_dagshub(usuario: str, repositorio: str) -> str:
    usuario_normalizado = normalizar_parte_uri(usuario, "usuario")
    repositorio_normalizado = normalizar_parte_uri(repositorio, "repositorio")

    return f"{URI_BASE_DAGSHUB}/{usuario_normalizado}/{repositorio_normalizado}.mlflow"


def carregar_configuracao_do_ambiente() -> ConfiguracaoMLflowDagsHub:
    usuario = os.getenv("DAGSHUB_USER", "").strip()
    repositorio = os.getenv("DAGSHUB_REPO", "").strip()
    experimento = os.getenv("MLFLOW_EXPERIMENT_NAME", EXPERIMENTO_PADRAO).strip()
    tracking_uri = os.getenv("MLFLOW_TRACKING_URI", "").strip()

    return ConfiguracaoMLflowDagsHub(
        usuario=usuario,
        repositorio=repositorio,
        experimento=experimento or EXPERIMENTO_PADRAO,
        tracking_uri=tracking_uri,
    )


def configurar_mlflow(configuracao: ConfiguracaoMLflowDagsHub | None = None) -> str:
    configuracao_final = configuracao or carregar_configuracao_do_ambiente()
    tracking_uri = configuracao_final.uri_final()

    try:
        import mlflow
    except ModuleNotFoundError as erro:
        raise RuntimeError(
            "MLflow não está instalado neste ambiente. "
        ) from erro

    mlflow.set_tracking_uri(tracking_uri)
    mlflow.set_experiment(configuracao_final.experimento)

    return tracking_uri
