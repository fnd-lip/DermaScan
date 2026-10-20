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
    verificandoSessao,
    salvarHistoricoAutomaticamente,
    setFaseFluxo,
    setAbaAtiva,
    handleLoginSucesso,
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
    const saiu = await encerrarSessao();

    if (!saiu) return false;

    resetarAnalise();
    setHistorico([]);
    return true;
  }, [encerrarSessao, resetarAnalise, setHistorico]);

  const handleReiniciarAppCompleto = useCallback(async () => {
    const saiu = await handleSairDaConta();

    if (!saiu) return;

    adicionarLog("Aplicação reiniciada para demonstração.", "info");
  }, [adicionarLog, handleSairDaConta]);

  return {
    estado: {
      faseFluxo,
      usuarioLogado,
      abaAtiva,
      verificandoSessao,
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
