interface ProbabilidadeMl {
  classe: string;
  codigo: string;
  probabilidade: number;
}

export interface ResultadoMl {
  classePrevista: string;
  codigo: string;
  confianca: number;
  nivelAtencao: "Baixo" | "Atenção" | "Alto";
  probabilidades: ProbabilidadeMl[];
  fonte: string;
}

export async function classificarComMlService(
  imageBase64: string,
): Promise<ResultadoMl> {
  const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:5001";

  const resposta = await fetch(`${mlServiceUrl}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageBase64,
    }),
  });

  if (!resposta.ok) {
    throw new Error("Falha ao classificar imagem no serviço de IA.");
  }

  const resultado = (await resposta.json()) as ResultadoMl;

  return resultado;
}