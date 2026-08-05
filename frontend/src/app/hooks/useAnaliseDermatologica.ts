import { useCallback, useState } from "react";
import { classificarImagemLesao } from "../../services/api";
import { Predicao } from "../../types/Predicao";
import { formatarPorcentagem } from "../../utils/formatarPorcentagem";
import { AbaAtiva, FaseAnalise, TipoLog } from "../types/fluxo";
import { criarPredicaoDaClassificacao } from "../utils/criarPredicaoDaClassificacao";

interface UseAnaliseDermatologicaParams {
  adicionarLog: (mensagem: string, tipo?: TipoLog) => void;
  salvarHistoricoAutomaticamente: boolean;
  carregarHistoricoDoBackend: () => Promise<void>;
  setAbaAtiva: (aba: AbaAtiva) => void;
}

export function useAnaliseDermatologica({
  adicionarLog,
  salvarHistoricoAutomaticamente,
  carregarHistoricoDoBackend,
  setAbaAtiva,
}: UseAnaliseDermatologicaParams) {
  const [faseAnalise, setFaseAnalise] = useState<FaseAnalise>("upload");
  const [imagemSelecionada, setImagemSelecionada] = useState("");
  const [isCustomPhoto, setIsCustomPhoto] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>(
    undefined,
  );
  const [predicaoAtiva, setPredicaoAtiva] = useState<Predicao | null>(null);
  const [salvoNoHistorico, setSalvoNoHistorico] = useState(false);

  const resetarAnalise = useCallback(() => {
    setFaseAnalise("upload");
    setImagemSelecionada("");
    setSelectedSampleId(undefined);
    setPredicaoAtiva(null);
    setSalvoNoHistorico(false);
  }, []);

  const handleImagemSelecionada = useCallback(
    (uri: string, sampleId?: string) => {
      setImagemSelecionada(uri);
      setSelectedSampleId(sampleId);
      setIsCustomPhoto(sampleId === "captured_photo");
      setFaseAnalise("conferir");

      adicionarLog(
        `Imagem recebida. Origem: ${sampleId || "Galeria externa"}.`,
        "info",
      );
    },
    [adicionarLog],
  );

  const handleVoltarParaUpload = useCallback(() => {
    resetarAnalise();
    adicionarLog("Retornando ao seletor de imagens.", "info");
  }, [adicionarLog, resetarAnalise]);

  const handleConfirmarEClassificar = useCallback(async () => {
    setFaseAnalise("processando");
    adicionarLog("Iniciando pipeline de classificação.", "ia");

    try {
      const resultado = await classificarImagemLesao(
        imagemSelecionada,
        selectedSampleId,
      );

      const predicao = criarPredicaoDaClassificacao({
        resultado,
        imagemSelecionada,
      });

      setPredicaoAtiva(predicao);
      setFaseAnalise("resultado");

      adicionarLog(
        `Classificação gerada: ${predicao.classePrevista} (${formatarPorcentagem(
          predicao.confianca,
        )}).`,
        "sucesso",
      );

      if (salvarHistoricoAutomaticamente) {
        await carregarHistoricoDoBackend();
        setSalvoNoHistorico(true);

        adicionarLog(
          "Análise salva no histórico do banco de dados.",
          "sucesso",
        );
      }
    } catch (error_) {
      const mensagemErro =
        error_ instanceof Error
          ? error_.message
          : "Não foi possível realizar a classificação.";

      adicionarLog(`Falha na classificação: ${mensagemErro}`, "erro");
      setFaseAnalise("upload");
      alert(mensagemErro);
    }
  }, [
    adicionarLog,
    carregarHistoricoDoBackend,
    imagemSelecionada,
    salvarHistoricoAutomaticamente,
    selectedSampleId,
  ]);

  const handleSalvarNoHistoricoManual = useCallback(async () => {
    if (!predicaoAtiva || salvoNoHistorico) return;

    await carregarHistoricoDoBackend();
    setSalvoNoHistorico(true);
    adicionarLog("Histórico sincronizado com o banco de dados.", "sucesso");
  }, [
    adicionarLog,
    carregarHistoricoDoBackend,
    predicaoAtiva,
    salvoNoHistorico,
  ]);

  const handleNovaAnaliseCompleta = useCallback(() => {
    resetarAnalise();
    setAbaAtiva("analise");
    adicionarLog("Reiniciando fluxo para nova análise.", "info");
  }, [adicionarLog, resetarAnalise, setAbaAtiva]);

  const handleVerDetalhesHistorico = useCallback(
    (item: Predicao) => {
      setPredicaoAtiva(item);
      setImagemSelecionada(item.imagemUri || "");
      setSalvoNoHistorico(true);
      setAbaAtiva("analise");
      setFaseAnalise("resultado");
      adicionarLog(`Visualizando laudo salvo: ${item.classePrevista}.`, "info");
    },
    [adicionarLog, setAbaAtiva],
  );

  const handleIrParaAnalise = useCallback(() => {
    setAbaAtiva("analise");
    setFaseAnalise("upload");
  }, [setAbaAtiva]);

  return {
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
  };
}
