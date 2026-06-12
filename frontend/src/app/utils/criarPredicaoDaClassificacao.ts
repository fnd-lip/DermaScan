import { Predicao } from "../../types/Predicao";

interface CriarPredicaoDaClassificacaoParams {
  resultado: Predicao;
  imagemSelecionada: string;
}

export function criarPredicaoDaClassificacao({
  resultado,
  imagemSelecionada,
}: CriarPredicaoDaClassificacaoParams): Predicao {
  return {
    id: resultado.id || `analise_${Date.now()}`,
    classePrevista: resultado.classePrevista,
    confianca: resultado.confianca,
    nivelAtencao: resultado.nivelAtencao as Predicao["nivelAtencao"],
    probabilidades: resultado.probabilidades,
    imagemUri: resultado.imagemUri || imagemSelecionada,
    dataAnalise:
      resultado.dataAnalise ||
      `${new Date().toLocaleDateString("pt-BR")} ${new Date().toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      )}`,
  };
}