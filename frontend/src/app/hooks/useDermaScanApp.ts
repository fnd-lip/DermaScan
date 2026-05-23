import { useEffect, useState } from "react";
import {
  buscarUsuarioAtual,
  classificarImagemLesao,
  excluirAnalise,
  limparAnalises,
  listarAnalises,
  sairDaContaBackend,
} from "../../services/api";
import { Predicao } from "../../types/Predicao";
import { formatarPorcentagem } from "../../utils/formatarPorcentagem";
import {
  AbaAtiva,
  FaseAnalise,
  FaseFluxo,
  LogSistema,
  TipoLog,
  UsuarioLogado,
} from "../types/fluxo";

export function useDermaScanApp() {
  const [faseFluxo, setFaseFluxo] = useState<FaseFluxo>("login");
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado | null>(
    null,
  );
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>("inicio");
  const [faseAnalise, setFaseAnalise] = useState<FaseAnalise>("upload");
  const [imagemSelecionada, setImagemSelecionada] = useState("");
  const [isCustomPhoto, setIsCustomPhoto] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>(
    undefined,
  );
  const [predicaoAtiva, setPredicaoAtiva] = useState<Predicao | null>(null);
  const [salvoNoHistorico, setSalvoNoHistorico] = useState(false);
  const [historico, setHistorico] = useState<Predicao[]>([]);
  const [salvarHistoricoAutomaticamente, setSalvarHistoricoAutomaticamente] =
    useState(true);
  const [logs, setLogs] = useState<LogSistema[]>([
    {
      tempo: new Date().toLocaleTimeString(),
      mensagem: "Sistema inicializado.",
      tipo: "info",
    },
  ]);

  const adicionarLog = (mensagem: string, tipo: TipoLog = "info") => {
    setLogs((anteriores) => [
      {
        tempo: new Date().toLocaleTimeString(),
        mensagem,
        tipo,
      },
      ...anteriores.slice(0, 15),
    ]);
  };

  const carregarHistoricoDoBackend = async () => {
    try {
      const analises = await listarAnalises();
      setHistorico(analises);
      adicionarLog("Histórico carregado do banco de dados.", "sucesso");
    } catch (erro) {
      console.error("Falha ao carregar histórico do backend:", erro);
      adicionarLog("Não foi possível carregar o histórico do backend.", "erro");
    }
  };

  useEffect(() => {
    const iniciarSessao = async () => {
      try {
        const autoSaveSalvo = localStorage.getItem("dermascan_autosave");

        if (autoSaveSalvo !== null) {
          setSalvarHistoricoAutomaticamente(autoSaveSalvo === "true");
        }

        const resposta = await buscarUsuarioAtual();

        setUsuarioLogado({
          nome: resposta.usuario.nome,
          email: resposta.usuario.email,
        });

        setFaseFluxo("abas");
        setAbaAtiva("inicio");

        adicionarLog(
          `Sessão ativa encontrada para ${resposta.usuario.nome}.`,
          "sucesso",
        );

        await carregarHistoricoDoBackend();
      } catch {
        setUsuarioLogado(null);
        setFaseFluxo("login");
        setAbaAtiva("inicio");
        adicionarLog("Nenhuma sessão ativa encontrada.", "info");
      }
    };

    void iniciarSessao();
  }, []);

  const handleLoginSucesso = (nome: string, email: string) => {
    setUsuarioLogado({ nome, email });
    setFaseFluxo("abas");
    setAbaAtiva("inicio");
    adicionarLog(`Acesso autorizado para ${nome}.`, "sucesso");
    void carregarHistoricoDoBackend();
  };

  const handleCadastroSucesso = (nome: string, email: string) => {
    setUsuarioLogado({ nome, email });
    setFaseFluxo("onboarding");
    adicionarLog(`Novo usuário registrado: ${nome}.`, "sucesso");
  };

  const handleFinalizarOnboarding = () => {
    setFaseFluxo("aviso_medico");
    adicionarLog("Onboarding concluído.", "info");
  };

  const handleAceitarAvisoMedico = () => {
    setFaseFluxo("abas");
    setAbaAtiva("inicio");
    adicionarLog("Aviso médico aceito pelo usuário.", "sucesso");
    void carregarHistoricoDoBackend();
  };

  const handleImagemSelecionada = (uri: string, sampleId?: string) => {
    setImagemSelecionada(uri);
    setSelectedSampleId(sampleId);
    setIsCustomPhoto(sampleId === "captured_photo");
    setFaseAnalise("conferir");
    adicionarLog(
      `Imagem recebida. Origem: ${sampleId || "Galeria externa"}.`,
      "info",
    );
  };

  const handleVoltarParaUpload = () => {
    setFaseAnalise("upload");
    setImagemSelecionada("");
    setSelectedSampleId(undefined);
    setPredicaoAtiva(null);
    setSalvoNoHistorico(false);
    adicionarLog("Retornando ao seletor de imagens.", "info");
  };

  const handleConfirmarEClassificar = async () => {
    setFaseAnalise("processando");
    adicionarLog("Iniciando pipeline de classificação.", "ia");

    try {
      const resultado = await classificarImagemLesao(
        imagemSelecionada,
        selectedSampleId,
      );

      const predicao: Predicao = {
        id: resultado.id || `analise_${Date.now()}`,
        classePrevista: resultado.classePrevista,
        confianca: resultado.confianca,
        nivelAtencao: resultado.nivelAtencao as Predicao["nivelAtencao"],
        probabilidades: resultado.probabilidades,
        imagemUri: resultado.imagemUri || imagemSelecionada,
        dataAnalise:
          resultado.dataAnalise ||
          `${new Date().toLocaleDateString("pt-BR")} ${new Date().toLocaleTimeString(
            "pt-BR",
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          )}`,
      };

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
    } catch (erro) {
      const mensagemErro =
        erro instanceof Error
          ? erro.message
          : "Não foi possível realizar a classificação.";

      adicionarLog(`Falha na classificação: ${mensagemErro}`, "erro");
      setFaseAnalise("upload");
      alert(mensagemErro);
    }
  };

  const handleSalvarNoHistoricoManual = async () => {
    if (!predicaoAtiva || salvoNoHistorico) return;

    await carregarHistoricoDoBackend();
    setSalvoNoHistorico(true);
    adicionarLog("Histórico sincronizado com o banco de dados.", "sucesso");
  };

  const handleExcluirLaudo = async (id: string) => {
    try {
      await excluirAnalise(id);
      await carregarHistoricoDoBackend();

      adicionarLog(`Análise ${id} excluída do banco de dados.`, "sucesso");
    } catch (erro) {
      const mensagemErro =
        erro instanceof Error
          ? erro.message
          : "Não foi possível excluir a análise.";

      adicionarLog(`Falha ao excluir análise: ${mensagemErro}`, "erro");
      alert(mensagemErro);
    }
  };

  const handleLimparTodosLaudos = async () => {
    if (
      !window.confirm(
        "Deseja apagar definitivamente todos os registros do histórico?",
      )
    ) {
      return;
    }

    try {
      await limparAnalises();
      setHistorico([]);

      adicionarLog("Histórico limpo no banco de dados.", "sucesso");
    } catch (erro) {
      const mensagemErro =
        erro instanceof Error
          ? erro.message
          : "Não foi possível limpar o histórico.";

      adicionarLog(`Falha ao limpar histórico: ${mensagemErro}`, "erro");
      alert(mensagemErro);
    }
  };

  const handleToggleSalvarAuto = (ativo: boolean) => {
    setSalvarHistoricoAutomaticamente(ativo);
    localStorage.setItem("dermascan_autosave", String(ativo));
    adicionarLog(
      `Salvamento automático ${ativo ? "ativado" : "desativado"}.`,
      "info",
    );
  };

  const handleNovaAnaliseCompleta = () => {
    setImagemSelecionada("");
    setSelectedSampleId(undefined);
    setPredicaoAtiva(null);
    setSalvoNoHistorico(false);
    setFaseAnalise("upload");
    setAbaAtiva("analise");
    adicionarLog("Reiniciando fluxo para nova análise.", "info");
  };

  const handleVerDetalhesHistorico = (item: Predicao) => {
    setPredicaoAtiva(item);
    setImagemSelecionada(item.imagemUri || "");
    setSalvoNoHistorico(true);
    setAbaAtiva("analise");
    setFaseAnalise("resultado");
    adicionarLog(`Visualizando laudo salvo: ${item.classePrevista}.`, "info");
  };

  const handleSairDaConta = async () => {
    try {
      await sairDaContaBackend();
    } catch (erro) {
      console.error("Erro ao encerrar sessão no backend:", erro);
    } finally {
      setUsuarioLogado(null);
      setFaseFluxo("login");
      setAbaAtiva("inicio");
      setFaseAnalise("upload");
      setImagemSelecionada("");
      setSelectedSampleId(undefined);
      setPredicaoAtiva(null);
      setSalvoNoHistorico(false);
      setHistorico([]);
      adicionarLog("Sessão encerrada.", "info");
    }
  };

  const handleReiniciarAppCompleto = () => {
    handleSairDaConta();
    setHistorico([]);
    adicionarLog("Aplicação reiniciada para demonstração.", "info");
  };

  const handleIrParaAnalise = () => {
    setAbaAtiva("analise");
    setFaseAnalise("upload");
  };

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
