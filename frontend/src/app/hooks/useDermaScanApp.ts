import { useCallback } from "react";
import { useAnaliseDermatologica } from "./useAnaliseDermatologica";
import { useHistoricoAnalises } from "./useHistoricoAnalises";
import { useLogsSistema } from "./useLogsSistema";
import { useSessaoUsuario } from "./useSessaoUsuario";

export function useDermaScanApp() {
  const { logs, adicionarLog } = useLogsSistema();

  const {
    historico,
    setHistorico,
    carregarHistoricoDoBackend,
    handleExcluirLaudo,
    handleLimparTodosLaudos,
  } = useHistoricoAnalises({ adicionarLog });

  const {
    faseFluxo,
    usuarioLogado,
    abaAtiva,
    salvarHistoricoAutomaticamente,
    setFaseFluxo,
    setAbaAtiva,
    handleLoginSucesso,
    handleCadastroSucesso,
    handleFinalizarOnboarding,
    handleAceitarAvisoMedico,
    handleToggleSalvarAuto,
    encerrarSessao,
  } = useSessaoUsuario({
    adicionarLog,
    carregarHistoricoDoBackend,
  });

  const {
    faseAnalise,
    imagemSelecionada,
    isCustomPhoto,
    predicaoAtiva,
    salvoNoHistorico,
    setFaseAnalise,
    resetarAnalise,
    handleImagemSelecionada,
    handleVoltarParaUpload,
    handleConfirmarEClassificar,
    handleSalvarNoHistoricoManual,
    handleNovaAnaliseCompleta,
    handleVerDetalhesHistorico,
    handleIrParaAnalise,
  } = useAnaliseDermatologica({
    adicionarLog,
    salvarHistoricoAutomaticamente,
    carregarHistoricoDoBackend,
    setAbaAtiva,
  });

  const handleSairDaConta = useCallback(async () => {
    await encerrarSessao();
    resetarAnalise();
    setHistorico([]);
  }, [encerrarSessao, resetarAnalise, setHistorico]);

  const handleReiniciarAppCompleto = useCallback(() => {
    void handleSairDaConta();
    setHistorico([]);
    adicionarLog("Aplicação reiniciada para demonstração.", "info");
  }, [adicionarLog, handleSairDaConta, setHistorico]);

  return {
    estado: {
      faseFluxo,
      usuarioLogado,
      abaAtiva,
      faseAnalise,
      imagemSelecionada,
      isCustomPhoto,
      predicaoAtiva,
      salvoNoHistorico,
      historico,
      salvarHistoricoAutomaticamente,
      logs,
    },
    acoes: {
      setFaseFluxo,
      setAbaAtiva,
      setFaseAnalise,
      handleLoginSucesso,
      handleCadastroSucesso,
      handleFinalizarOnboarding,
      handleAceitarAvisoMedico,
      handleImagemSelecionada,
      handleVoltarParaUpload,
      handleConfirmarEClassificar,
      handleSalvarNoHistoricoManual,
      handleExcluirLaudo,
      handleLimparTodosLaudos,
      handleToggleSalvarAuto,
      handleNovaAnaliseCompleta,
      handleVerDetalhesHistorico,
      handleSairDaConta,
      handleReiniciarAppCompleto,
      handleIrParaAnalise,
    },
  };
}