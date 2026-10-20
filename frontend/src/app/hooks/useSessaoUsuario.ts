import { useCallback, useEffect, useRef, useState } from "react";
import { buscarUsuarioAtual, sairDaContaBackend } from "../../services/api";
import type {
  AbaAtiva,
  FaseFluxo,
  TipoLog,
  UsuarioLogado,
} from "../types/fluxo";

interface UseSessaoUsuarioParams {
  adicionarLog: (mensagem: string, tipo?: TipoLog) => void;
  carregarHistoricoDoBackend: () => Promise<void>;
}

export function useSessaoUsuario({
  adicionarLog,
  carregarHistoricoDoBackend,
}: UseSessaoUsuarioParams) {
  const [faseFluxo, setFaseFluxo] = useState<FaseFluxo>("landing");
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado | null>(
    null,
  );
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>("inicio");
  const [verificandoSessao, setVerificandoSessao] = useState(true);
  const [salvarHistoricoAutomaticamente, setSalvarHistoricoAutomaticamente] =
    useState(true);
  const versaoSessao = useRef(0);

  const carregarHistoricoSeguro = useCallback(async () => {
    try {
      await carregarHistoricoDoBackend();
    } catch (error_) {
      console.error("Falha ao carregar histórico:", error_);
      adicionarLog(
        "Não foi possível carregar o histórico de análises.",
        "erro",
      );
    }
  }, [adicionarLog, carregarHistoricoDoBackend]);

  const resetarSessaoLocal = useCallback(() => {
    setUsuarioLogado(null);
    setFaseFluxo("landing");
    setAbaAtiva("inicio");
  }, []);

  const iniciarSessao = useCallback(async () => {
    const versao = ++versaoSessao.current;

    try {
      const autoSave = localStorage.getItem("dermascan_autosave");

      if (autoSave !== null) {
        setSalvarHistoricoAutomaticamente(autoSave === "true");
      }

      const resposta = await buscarUsuarioAtual();
      if (versao !== versaoSessao.current) return;

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
      void carregarHistoricoSeguro();
    } catch (error_) {
      if (versao !== versaoSessao.current) return;

      console.error("Falha ao verificar sessão:", error_);
      resetarSessaoLocal();
      adicionarLog("Não foi possível confirmar uma sessão ativa.", "info");
    } finally {
      if (versao === versaoSessao.current) {
        setVerificandoSessao(false);
      }
    }
  }, [adicionarLog, carregarHistoricoSeguro, resetarSessaoLocal]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void iniciarSessao(), 0);

    return () => {
      window.clearTimeout(timeoutId);
      versaoSessao.current += 1;
    };
  }, [iniciarSessao]);

  const handleLoginSucesso = useCallback(
    (nome: string, email: string) => {
      versaoSessao.current += 1;
      setVerificandoSessao(false);
      setUsuarioLogado({ nome, email });
      setFaseFluxo("abas");
      setAbaAtiva("inicio");
      adicionarLog(`Acesso autorizado para ${nome}.`, "sucesso");
      void carregarHistoricoSeguro();
    },
    [adicionarLog, carregarHistoricoSeguro],
  );

  const handleToggleSalvarAuto = useCallback(
    (ativo: boolean) => {
      setSalvarHistoricoAutomaticamente(ativo);
      localStorage.setItem("dermascan_autosave", String(ativo));
      adicionarLog(
        `Salvamento automático ${ativo ? "ativado" : "desativado"}.`,
        "info",
      );
    },
    [adicionarLog],
  );

  const encerrarSessao = useCallback(async (): Promise<boolean> => {
    try {
      await sairDaContaBackend();

      versaoSessao.current += 1;
      resetarSessaoLocal();
      setVerificandoSessao(false);
      adicionarLog("Sessão encerrada.", "info");

      return true;
    } catch (error_) {
      console.error("Erro ao encerrar sessão:", error_);
      adicionarLog("Não foi possível sair da conta. Tente novamente.", "erro");

      return false;
    }
  }, [adicionarLog, resetarSessaoLocal]);

  return {
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
  };
}
