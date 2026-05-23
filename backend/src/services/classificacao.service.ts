const CLASSES_DERMATOLOGICAS = [
  { classe: "Melanoma", nivelAtencao: "Alto" },
  { classe: "Carcinoma basocelular", nivelAtencao: "Alto" },
  { classe: "Ceratose actínica", nivelAtencao: "Atenção" },
  { classe: "Nevo melanocítico", nivelAtencao: "Baixo" },
  { classe: "Ceratose benigna", nivelAtencao: "Baixo" },
  { classe: "Dermatofibroma", nivelAtencao: "Baixo" },
  { classe: "Lesão vascular", nivelAtencao: "Baixo" },
];

const URLS_AMOSTRAS: Record<string, string> = {
  melanoma_sample:
    "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400",
  nevo_sample:
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=400",
  carcinoma_sample:
    "https://images.unsplash.com/photo-1614850523011-8f49fc946657?auto=format&fit=crop&q=80&w=400",
};

export function obterPredicaoPreset(id: string) {
  if (id === "melanoma_sample") {
    return {
      classePrevista: "Melanoma",
      confianca: 0.89,
      nivelAtencao: "Alto",
      probabilidades: [
        { classe: "Melanoma", probabilidade: 0.89 },
        { classe: "Carcinoma basocelular", probabilidade: 0.06 },
        { classe: "Ceratose actínica", probabilidade: 0.03 },
        { classe: "Nevo melanocítico", probabilidade: 0.01 },
        { classe: "Outros / Benignos", probabilidade: 0.01 },
      ],
    };
  }

  if (id === "nevo_sample") {
    return {
      classePrevista: "Nevo melanocítico",
      confianca: 0.94,
      nivelAtencao: "Baixo",
      probabilidades: [
        { classe: "Nevo melanocítico", probabilidade: 0.94 },
        { classe: "Ceratose benigna", probabilidade: 0.03 },
        { classe: "Melanoma", probabilidade: 0.02 },
        { classe: "Dermatofibroma", probabilidade: 0.01 },
      ],
    };
  }

  if (id === "carcinoma_sample") {
    return {
      classePrevista: "Carcinoma basocelular",
      confianca: 0.78,
      nivelAtencao: "Alto",
      probabilidades: [
        { classe: "Carcinoma basocelular", probabilidade: 0.78 },
        { classe: "Ceratose actínica", probabilidade: 0.12 },
        { classe: "Ceratose benigna", probabilidade: 0.05 },
        { classe: "Melanoma", probabilidade: 0.03 },
        { classe: "Outros", probabilidade: 0.02 },
      ],
    };
  }

  return null;
}

export function gerarClassificacaoLocal(seedId: string) {
  const valorSeed = seedId
    .split("")
    .reduce((total, caractere) => total + caractere.charCodeAt(0), 0);

  const indicePrincipal = valorSeed % CLASSES_DERMATOLOGICAS.length;
  const classePrincipal = CLASSES_DERMATOLOGICAS[indicePrincipal];

  const probabilidadePrincipal = 0.65 + (valorSeed % 25) / 100;
  const restante = 1 - probabilidadePrincipal;

  const probabilidades = CLASSES_DERMATOLOGICAS.map((item, indice) => {
    if (indice === indicePrincipal) {
      return {
        classe: item.classe,
        probabilidade: probabilidadePrincipal,
      };
    }

    const peso = (indice + 1) / 30;

    return {
      classe: item.classe,
      probabilidade: restante * peso,
    };
  });

  const soma = probabilidades.reduce(
    (total, item) => total + item.probabilidade,
    0,
  );

  const probabilidadesNormalizadas = probabilidades
    .map((item) => ({
      classe: item.classe,
      probabilidade: Number((item.probabilidade / soma).toFixed(2)),
    }))
    .sort((a, b) => b.probabilidade - a.probabilidade);

  return {
    classePrevista: classePrincipal.classe,
    confianca: probabilidadesNormalizadas[0].probabilidade,
    nivelAtencao: classePrincipal.nivelAtencao,
    probabilidades: probabilidadesNormalizadas,
  };
}

export function classificarLesao(sampleId?: string) {
  const imagemUrl = obterImagemUrlPorSampleId(sampleId);

  if (sampleId) {
    const predicaoPreset = obterPredicaoPreset(sampleId);

    if (predicaoPreset) {
      return {
        ...predicaoPreset,
        sampleId,
        imagemUrl,
        fonte: "Modelo local predefinido",
        dataAnalise: new Date().toISOString(),
      };
    }
  }

  return {
    ...gerarClassificacaoLocal(sampleId || "upload_usuario"),
    sampleId,
    imagemUrl,
    fonte: "Simulador local de classificação",
    dataAnalise: new Date().toISOString(),
  };
}

export function obterImagemUrlPorSampleId(sampleId?: string) {
  if (!sampleId) return null;

  return URLS_AMOSTRAS[sampleId] ?? null;
}