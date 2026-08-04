interface ProbabilidadeMl {
  classe: string;
  codigo: string;
  probabilidade: number;
  probabilidadePercentual: number;
  nivelAtencao: "Baixo" | "Atenção" | "Alto";
  alerta: boolean;
}

export interface ResultadoMl {
  classePrevista: string;
  codigo: string;
  confianca: number;
  confiancaPercentual: number;
  nivelAtencao: "Baixo" | "Atenção" | "Alto";
  alertaAtencao: boolean;
  alertas: Record<string, boolean>;
  probabilidades: ProbabilidadeMl[];
  fonte: string;
}

export async function classificarComMlService(
  imageBase64: string,
): Promise<ResultadoMl> {
  const mlServiceUrl = (
    process.env.ML_SERVICE_URL || "http://localhost:5001"
  ).replace(/\/+$/, "");

  const resposta = await fetch(`${mlServiceUrl}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageBase64,
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text();

    console.error(`Erro do ML Service (${resposta.status}):`, detalhe);

    throw new Error("Falha ao classificar imagem no serviço de IA");
  }

  return (await resposta.json()) as ResultadoMl;
}
