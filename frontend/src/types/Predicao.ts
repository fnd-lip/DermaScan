export interface Probabilidade {
  classe: string;
  probabilidade: number;
}

export interface Predicao {
  classePrevista: string;
  confianca: number;
  nivelAtencao: 'Baixo' | 'Atenção' | 'Alto';
  probabilidades: Probabilidade[];
  dataAnalise?: string;
  id?: string;
  imagemUri?: string;
}



