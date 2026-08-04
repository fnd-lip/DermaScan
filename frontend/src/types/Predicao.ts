export type NivelAtencao = "Baixo" | "Atenção" | "Alto";

export interface Probabilidade {
  classe: string;
  codigo?: string;
  probabilidade: number;
  probabilidadePercentual?: number;
  nivelAtencao?: NivelAtencao;
  alerta?: boolean;
}

export interface Predicao {
  id?: string;
  classePrevista: string;
  codigo?: string;

  confianca: number;
  confiancaPercentual?: number;

  nivelAtencao: NivelAtencao;
  alertaAtencao?: boolean;
  alertas?: Record<string, boolean>;

  probabilidades: Probabilidade[];

  fonte?: string;
  dataAnalise?: string;
  imagemUri?: string;
}
