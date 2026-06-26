import type { DetalhesClasseResultado } from "./types";

export const DESCRICAO_PADRAO_RESULTADO: DetalhesClasseResultado = {
  sintomas: "Lesão dermatológica registrada.",
  acao: "Consulte um dermatologista ou profissional de saúde em caso de dúvidas.",
  detalhe: "Sem descrição específica para esta classe.",
};

export const DESCRICOES_CLASSES: Record<string, DetalhesClasseResultado> = {
  Melanoma: {
    sintomas:
      "Lesão com sinais visuais de maior atenção, como assimetria, bordas irregulares, variações de cor ou evolução recente.",
    acao: "Procure avaliação presencial com dermatologista com prioridade para confirmação e orientação adequada.",
    detalhe:
      "O melanoma é uma condição dermatológica séria. A identificação precoce aumenta as possibilidades de tratamento efetivo.",
  },

  "Carcinoma basocelular": {
    sintomas:
      "Pode aparecer como lesão elevada, brilhante, com pequenas feridas, vasos visíveis ou crescimento lento em áreas expostas ao sol.",
    acao: "Agende avaliação com dermatologista para confirmação clínica e definição da melhor conduta.",
    detalhe:
      "É um dos tumores de pele mais frequentes e costuma ter crescimento local. Mesmo assim, precisa de avaliação profissional.",
  },

  "Ceratose actínica": {
    sintomas:
      "Pode surgir como área áspera, descamativa, avermelhada ou sensível, geralmente associada à exposição solar acumulada.",
    acao: "Consulte um dermatologista para verificar se há necessidade de tratamento ou acompanhamento.",
    detalhe:
      "É uma lesão relacionada ao dano solar crônico e pode exigir cuidados preventivos.",
  },

  "Nevo melanocitico": {
    sintomas:
      "Pinta geralmente simétrica, com cor mais uniforme e bordas bem delimitadas.",
    acao: "Continue acompanhando mudanças de tamanho, cor, formato, coceira, ferida ou sangramento.",
    detalhe:
      "Nevo melanocítico é uma pinta comum. Mudanças visuais relevantes devem ser avaliadas por profissional de saúde.",
  },

  "Nevo melanocítico": {
    sintomas:
      "Pinta geralmente simétrica, com cor mais uniforme e bordas bem delimitadas.",
    acao: "Continue acompanhando mudanças de tamanho, cor, formato, coceira, ferida ou sangramento.",
    detalhe:
      "Nevo melanocítico é uma pinta comum. Mudanças visuais relevantes devem ser avaliadas por profissional de saúde.",
  },

  "Ceratose benigna": {
    sintomas:
      "Pode ter aspecto elevado, ceroso, verrucoso ou semelhante a uma pequena placa sobre a pele.",
    acao: "Em geral não indica urgência, mas pode ser avaliada se houver crescimento, irritação, sangramento ou incômodo.",
    detalhe:
      "Ceratose benigna é uma alteração comum da pele, especialmente com o envelhecimento.",
  },

  Dermatofibroma: {
    sintomas:
      "Nódulo pequeno, firme, geralmente acastanhado ou avermelhado, podendo aparecer após pequenos traumas ou picadas.",
    acao: "Acompanhe a lesão e procure avaliação se houver dor, crescimento rápido, sangramento ou mudança importante.",
    detalhe:
      "Costuma ser benigno, mas a avaliação presencial é importante quando há dúvida ou alteração visual.",
  },

  "Lesão vascular": {
    sintomas:
      "Pode aparecer como ponto, mancha ou pequena elevação avermelhada, arroxeada ou azulada.",
    acao: "Procure avaliação se houver crescimento rápido, sangramento, dor ou alteração visual recente.",
    detalhe:
      "Lesões vasculares envolvem vasos sanguíneos da pele e muitas vezes são benignas, mas devem ser avaliadas em caso de mudança.",
  },
};
