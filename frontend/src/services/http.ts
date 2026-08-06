const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function requisicaoApi<T>(
  rota: string,
  opcoes: RequestInit = {},
): Promise<T> {
  const resposta = await fetch(`${API_URL}${rota}`, {
    ...opcoes,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...opcoes.headers,
    },
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.message || erro.error || "Erro na requisição.");
  }

  return resposta.json();
}
