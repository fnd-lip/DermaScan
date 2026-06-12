import { useCallback, useState } from "react";
import {
  excluirAnalise,
  limparAnalises,
  listarAnalises,
} from "../../services/api";
import { Predicao } from "../../types/Predicao";
import { TipoLog } from "../types/fluxo";

interface UseHistoricoAnalisesParams {
  adicionarLog: (mensagem: string, tipo?: TipoLog) => void;
}

export function useHistoricoAnalises({
  adicionarLog,
}: UseHistoricoAnalisesParams) {
  const [historico, setHistorico] = useState<Predicao[]>([]);

  const carregarHistoricoDoBackend = useCallback(async () => {
    try {
      const analises = await listarAnalises();

      setHistorico(analises);
      adicionarLog("Histórico carregado do banco de dados.", "sucesso");
    } catch (erro) {
      console.error("Falha ao carregar histórico do backend:", erro);
      adicionarLog("Não foi possível carregar o histórico do backend.", "erro");
    }
  }, [adicionarLog]);

  const handleExcluirLaudo = useCallback(
    async (id: string) => {
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
    },
    [adicionarLog, carregarHistoricoDoBackend],
  );

  const handleLimparTodosLaudos = useCallback(async () => {
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
  }, [adicionarLog]);

  return {
    historico,
    setHistorico,
    carregarHistoricoDoBackend,
    handleExcluirLaudo,
    handleLimparTodosLaudos,
  };
}