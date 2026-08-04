import { Predicao } from "../../types/Predicao";

interface CriarPredicaoDaClassificacaoParams {
  resultado: Predicao;
  imagemSelecionada: string;
}

export function criarPredicaoDaClassificacao({
  resultado,
  imagemSelecionada,
}: CriarPredicaoDaClassificacaoParams): Predicao {
  const agora = new Date();

  return {
    ...resultado,

    id: resultado.id || `analise_${Date.now()}`,

    imagemUri:
      resultado.imagemUri || imagemSelecionada,

    dataAnalise:
      resultado.dataAnalise ||
      `${agora.toLocaleDateString("pt-BR")} ${agora.toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      )}`,
  };
}