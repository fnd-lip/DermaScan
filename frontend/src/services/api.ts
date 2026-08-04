import { Predicao } from "../types/Predicao";
import { requisicaoApi } from "./http";

export async function classificarImagemLesao(
  imagemBase64: string,
  sampleId?: string,
): Promise<Predicao> {
  try {
    return await requisicaoApi<Predicao>("/api/classify", {
      method: "POST",
      body: JSON.stringify({
        imageBase64: imagemBase64,
        sampleId,
      }),
    });
  } catch (erro) {
    console.error("Erro na chamada da API de classificação:", erro);

    throw new Error(
      "Não foi possível realizar a análise no momento. Verifique sua conexão e tente novamente.",
      {
        cause: erro,
      },
    );
  }
}

export async function listarAnalises(): Promise<Predicao[]> {
  return requisicaoApi<Predicao[]>("/api/analyses", {
    method: "GET",
  });
}

export async function excluirAnalise(id: string): Promise<{ mensagem: string }> {
  return requisicaoApi<{ mensagem: string }>(`/api/analyses/${id}`, {
    method: "DELETE",
  });
}

export async function limparAnalises(): Promise<{ mensagem: string }> {
  return requisicaoApi<{ mensagem: string }>("/api/analyses", {
    method: "DELETE",
  });
}

interface UsuarioAutenticado {
  id: string;
  nome: string;
  email: string;
}

interface RespostaAuth {
  usuario: UsuarioAutenticado;
  mensagem?: string;
}

export async function cadastrarUsuarioBackend(
  nome: string,
  email: string,
  senha: string,
): Promise<RespostaAuth> {
  return requisicaoApi<RespostaAuth>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      nome,
      email,
      senha,
    }),
  });
}

export async function fazerLoginBackend(
  email: string,
  senha: string,
): Promise<RespostaAuth> {
  return requisicaoApi<RespostaAuth>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      senha,
    }),
  });
}

export async function buscarUsuarioAtual(): Promise<RespostaAuth> {
  return requisicaoApi<RespostaAuth>("/auth/me", {
    method: "GET",
  });
}

export async function sairDaContaBackend(): Promise<{ mensagem: string }> {
  return requisicaoApi<{ mensagem: string }>("/auth/logout", {
    method: "POST",
  });
}