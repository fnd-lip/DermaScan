import { AnimatePresence } from 'motion/react';
import { useDermaScanApp } from './hooks/useDermaScanApp';
import { AppShell } from '../components/layout/AppShell';
import { DashboardPrincipal } from '../components/navigation/DashboardPrincipal';
import { FluxoAutenticacao } from '../components/navigation/FluxoAutenticacao';

export default function App() {
  const { estado, acoes } = useDermaScanApp();

  return (
    <AppShell
      mostrarCabecalho={estado.faseFluxo === 'abas'}
      usuarioLogado={estado.usuarioLogado}
    >
      {estado.faseFluxo !== 'abas' ? (
        <FluxoAutenticacao
          faseFluxo={estado.faseFluxo}
          onLoginSucesso={acoes.handleLoginSucesso}
          onCadastroSucesso={acoes.handleCadastroSucesso}
          onFinalizarOnboarding={acoes.handleFinalizarOnboarding}
          onAceitarAvisoMedico={acoes.handleAceitarAvisoMedico}
        />
      ) : (
        <AnimatePresence mode="wait">
          <DashboardPrincipal
            abaAtiva={estado.abaAtiva}
            faseAnalise={estado.faseAnalise}
            usuarioLogado={estado.usuarioLogado}
            historico={estado.historico}
            imagemSelecionada={estado.imagemSelecionada}
            isCustomPhoto={estado.isCustomPhoto}
            predicaoAtiva={estado.predicaoAtiva}
            salvoNoHistorico={estado.salvoNoHistorico}
            salvarHistoricoAutomaticamente={estado.salvarHistoricoAutomaticamente}
            onAlterarAba={acoes.setAbaAtiva}
            onPrepararAnalise={acoes.handleIrParaAnalise}
            onIrParaHistorico={() => acoes.setAbaAtiva('historico')}
            onIrParaEducacao={() => acoes.setAbaAtiva('educacao')}
            onSelecionarImagem={acoes.handleImagemSelecionada}
            onVoltarParaUpload={acoes.handleVoltarParaUpload}
            onConfirmarAnalise={acoes.handleConfirmarEClassificar}
            onNovaAnalise={acoes.handleNovaAnaliseCompleta}
            onSalvarNoHistorico={acoes.handleSalvarNoHistoricoManual}
            onSelecionarHistorico={acoes.handleVerDetalhesHistorico}
            onExcluirHistorico={acoes.handleExcluirLaudo}
            onLimparHistorico={acoes.handleLimparTodosLaudos}
            onToggleSalvarAuto={acoes.handleToggleSalvarAuto}
            onRecarregarApp={acoes.handleReiniciarAppCompleto}
            onSairDaConta={acoes.handleSairDaConta}
          />
        </AnimatePresence>
      )}
    </AppShell>
  );
}



