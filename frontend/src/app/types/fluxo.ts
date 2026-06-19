import { Predicao } from '../../types/Predicao';

export type FaseFluxo = 'login' | 'cadastro' | 'onboarding' | 'aviso_medico' | 'abas';
export type AbaAtiva = 'inicio' | 'analise' | 'historico' | 'educacao' | 'perfil' | 'configuracoes';
export type FaseAnalise = 'upload' | 'conferir' | 'processando' | 'resultado';
export type TipoLog = 'info' | 'sucesso' | 'erro' | 'ia';

export interface UsuarioLogado {
  nome: string;
  email: string;
}

export interface LogSistema {
  tempo: string;
  mensagem: string;
  tipo: TipoLog;
}

export interface EstadoDermaScan {
  faseFluxo: FaseFluxo;
  usuarioLogado: UsuarioLogado | null;
  abaAtiva: AbaAtiva;
  faseAnalise: FaseAnalise;
  imagemSelecionada: string;
  isCustomPhoto: boolean;
  predicaoAtiva: Predicao | null;
  salvoNoHistorico: boolean;
  historico: Predicao[];
  salvarHistoricoAutomaticamente: boolean;
  logs: LogSistema[];
}



