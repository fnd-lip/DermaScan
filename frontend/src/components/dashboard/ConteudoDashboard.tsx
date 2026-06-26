import React from "react";
import { TelaConfiguracoes } from "../../screens/TelaConfiguracoes";
import { TelaEducacao } from "../../screens/TelaEducacao";
import { TelaHistorico } from "../../screens/TelaHistorico";
import { TelaInicio } from "../../screens/TelaInicio";
import { TelaPerfil } from "../../screens/TelaPerfil";
import { TelaAnaliseWorkspace } from "./TelaAnaliseWorkspace";
import type { ConteudoDashboardProps } from "./types";

export const ConteudoDashboard: React.FC<ConteudoDashboardProps> = ({
  abaAtiva,
  faseAnalise,
  usuarioLogado,
  historico,
  imagemSelecionada,
  isCustomPhoto,
  predicaoAtiva,
  salvoNoHistorico,
  salvarHistoricoAutomaticamente,
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
    <section className="min-h-0 flex-1 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="h-full min-h-0 overflow-hidden">
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
    </section>
  );
};
