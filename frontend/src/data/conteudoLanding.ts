export interface PrincipioLanding {
  readonly numero: string;
  readonly nome: string;
  readonly titulo: string;
  readonly descricao: string;
}

export interface PerguntaLanding {
  readonly pergunta: string;
  readonly resposta: string;
}

export const principiosLanding: readonly PrincipioLanding[] = [
  {
    numero: "01",
    nome: "Observar",
    titulo: "Dar atenção aos detalhes.",
    descricao:
      "A imagem é um ponto de partida. Nosso foco está nas informações que ajudam o profissional a observar alterações na pele.",
  },
  {
    numero: "02",
    nome: "Compreender",
    titulo: "Considerar a história.",
    descricao:
      "Uma fotografia não conta tudo. A proposta aproxima a observação visual do contexto clínico de cada pessoa.",
  },
  {
    numero: "03",
    nome: "Apoiar",
    titulo: "Preservar o olhar profissional.",
    descricao:
      "A tecnologia deve apoiar quem cuida. O julgamento clínico e a responsabilidade pela decisão continuam com o profissional.",
  },
];

export const perguntasLanding: readonly PerguntaLanding[] = [
  {
    pergunta: "Para quem é o DermaScan?",
    resposta:
      "Para profissionais de saúde, com foco no apoio à avaliação inicial de lesões dermatológicas.",
  },
  {
    pergunta: "Qual é a proposta da plataforma?",
    resposta:
      "Apoiar a avaliação visual de lesões de pele, considerando também a importância do contexto clínico.",
  },
  {
    pergunta: "O DermaScan faz um diagnóstico?",
    resposta:
      "Não substitui o diagnóstico médico, o julgamento clínico ou a responsabilidade do profissional.",
  },
  {
    pergunta: "Por que considerar o contexto clínico?",
    resposta:
      "A imagem registra um momento. O histórico e as informações clínicas ajudam a compreender o que ela não mostra sozinha.",
  },
];
