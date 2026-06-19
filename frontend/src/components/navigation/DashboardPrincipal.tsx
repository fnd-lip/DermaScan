import React from "react";
import { Predicao } from "../../types/Predicao";
import { AbaAtiva, FaseAnalise, UsuarioLogado } from "../../app/types/fluxo";
import { MenuLateral } from "./MenuLateral";
import { TelaInicio } from "../../screens/TelaInicio";
import { TelaAnalise } from "../../screens/TelaAnalise";
import { TelaConferirImagem } from "../../screens/TelaConferirImagem";
import { TelaProcessandoAnalise } from "../../screens/TelaProcessandoAnalise";
import { TelaResultado } from "../../screens/TelaResultado";
import { TelaHistorico } from "../../screens/TelaHistorico";
import { TelaEducacao } from "../../screens/TelaEducacao";
import { TelaPerfil } from "../../screens/TelaPerfil";
import { TelaConfiguracoes } from "../../screens/TelaConfiguracoes";

interface DashboardPrincipalProps {
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

export const DashboardPrincipal: React.FC<DashboardPrincipalProps> = ({
  abaAtiva,
  faseAnalise,
  usuarioLogado,
  historico,
  imagemSelecionada,
  isCustomPhoto,
  predicaoAtiva,
  salvoNoHistorico,
  salvarHistoricoAutomaticamente,
  onAlterarAba,
  onPrepararAnalise,
  onIrParaHistorico,
  onIrParaEducacao,
  onSelecionarImagem,
  onVoltarParaUpload,
  onConfirmarAnalise,
  onNovaAnalise,
  onSalvarNoHistorico,
  onSelecionarHistorico,
  onExcluirHistorico,
  onLimparHistorico,
  onToggleSalvarAuto,
  onRecarregarApp,
  onSairDaConta,
}) => {
  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
      <MenuLateral
        abaAtiva={abaAtiva}
        usuarioLogado={usuarioLogado}
        onAlterarAba={onAlterarAba}
        onPrepararAnalise={onPrepararAnalise}
      />

      <div className="flex-1 bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full relative">
        <div className="flex-1 relative overflow-hidden h-full">
          {abaAtiva === "inicio" && (
            <TelaInicio
              onIrParaAnalise={onPrepararAnalise}
              onIrParaHistorico={onIrParaHistorico}
              onIrParaEducacao={onIrParaEducacao}
              ultimaAnalise={historico[0] || null}
              onVerDetalhesUltima={onSelecionarHistorico}
              nomeUsuario={usuarioLogado?.nome}
            />
          )}

          {abaAtiva === "analise" && (
            <TelaAnaliseWorkspace
              faseAnalise={faseAnalise}
              imagemSelecionada={imagemSelecionada}
              isCustomPhoto={isCustomPhoto}
              predicaoAtiva={predicaoAtiva}
              salvoNoHistorico={salvoNoHistorico}
              onSelecionarImagem={onSelecionarImagem}
              onVoltarParaUpload={onVoltarParaUpload}
              onConfirmarAnalise={onConfirmarAnalise}
              onNovaAnalise={onNovaAnalise}
              onSalvarNoHistorico={onSalvarNoHistorico}
            />
          )}

          {abaAtiva === "historico" && (
            <TelaHistorico
              historico={historico}
              onSelecionarItem={onSelecionarHistorico}
              onExcluirItem={onExcluirHistorico}
              onLimparHistorico={onLimparHistorico}
            />
          )}

          {abaAtiva === "educacao" && <TelaEducacao />}

          {abaAtiva === "perfil" && (
            <TelaPerfil
              onRecarregarApp={onRecarregarApp}
              historicoCount={historico.length}
              nomeUsuario={usuarioLogado?.nome}
              emailUsuario={usuarioLogado?.email}
              onSairDaConta={onSairDaConta}
            />
          )}

          {abaAtiva === "configuracoes" && (
            <TelaConfiguracoes
              salvarHistoricoAutomaticamente={salvarHistoricoAutomaticamente}
              onToggleSalvarAuto={onToggleSalvarAuto}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface TelaAnaliseWorkspaceProps {
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

const TelaAnaliseWorkspace: React.FC<TelaAnaliseWorkspaceProps> = ({
  faseAnalise,
  imagemSelecionada,
  isCustomPhoto,
  predicaoAtiva,
  salvoNoHistorico,
  onSelecionarImagem,
  onVoltarParaUpload,
  onConfirmarAnalise,
  onNovaAnalise,
  onSalvarNoHistorico,
}) => {
  return (
    <div className="h-full relative overflow-hidden">
      {faseAnalise === "upload" && (
        <TelaAnalise onImagemSelecionada={onSelecionarImagem} />
      )}

      {faseAnalise === "conferir" && (
        <TelaConferirImagem
          imagemUri={imagemSelecionada}
          onVoltar={onVoltarParaUpload}
          onConfirmar={onConfirmarAnalise}
          isCustomPhoto={isCustomPhoto}
        />
      )}

      {faseAnalise === "processando" && (
        <TelaProcessandoAnalise onFinalizarProcessamento={() => {}} />
      )}

      {faseAnalise === "resultado" && predicaoAtiva && (
        <TelaResultado
          predicao={predicaoAtiva}
          imagemUri={imagemSelecionada}
          onNovaAnalise={onNovaAnalise}
          onSalvarNoHistorico={onSalvarNoHistorico}
          salvo={salvoNoHistorico}
        />
      )}
    </div>
  );
};
