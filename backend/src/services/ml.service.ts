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

function removerBarrasFinais(url: string): string {
  let fim = url.length;

  while (fim > 0 && url[fim - 1] === "/") {
    fim -= 1;
  }

  return url.slice(0, fim);
}

export async function classificarComMlService(
  imageBase64: string,
): Promise<ResultadoMl> {
  const mlServiceUrl = removerBarrasFinais(
    process.env.ML_SERVICE_URL || "http://localhost:5001",
  );

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
    console.error("O ML Service retornou uma resposta de erro");

    throw new Error("Falha ao classificar imagem no serviço de IA");
  }

  return (await resposta.json()) as ResultadoMl;
}
