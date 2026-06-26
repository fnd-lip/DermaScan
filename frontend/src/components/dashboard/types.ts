import type {
  AbaAtiva,
  FaseAnalise,
  UsuarioLogado,
} from "../../app/types/fluxo";
import type { Predicao } from "../../types/Predicao";

export interface DashboardPrincipalProps {
  abaAtiva: AbaAtiva;
  faseAnalise: FaseAnalise;
  usuarioLogado: UsuarioLogado | null;
  historico: Predicao[];
  imagemSelecionada: string;
  isCustomPhoto: boolean;
  predicaoAtiva: Predicao | null;
  salvoNoHistorico: boolean;
  salvarHistoricoAutomaticamente: boolean;
  onAlterarAba: (aba: AbaAtiva) => void;
  onPrepararAnalise: () => void;
  onIrParaHistorico: () => void;
  onIrParaEducacao: () => void;
  onSelecionarImagem: (uri: string, sampleId?: string) => void;
  onVoltarParaUpload: () => void;
  onConfirmarAnalise: () => void;
  onNovaAnalise: () => void;
  onSalvarNoHistorico: () => void;
  onSelecionarHistorico: (item: Predicao) => void;
  onExcluirHistorico: (id: string) => void;
  onLimparHistorico: () => void;
  onToggleSalvarAuto: (ativo: boolean) => void;
  onRecarregarApp: () => void;
  onSairDaConta: () => void;
}

export type ConteudoDashboardProps = Omit<
  DashboardPrincipalProps,
  "onAlterarAba"
>;

export interface TelaAnaliseWorkspaceProps {
  faseAnalise: FaseAnalise;
  imagemSelecionada: string;
  isCustomPhoto: boolean;
  predicaoAtiva: Predicao | null;
  salvoNoHistorico: boolean;
  onSelecionarImagem: (uri: string, sampleId?: string) => void;
  onVoltarParaUpload: () => void;
  onConfirmarAnalise: () => void;
  onNovaAnalise: () => void;
  onSalvarNoHistorico: () => void;
}
