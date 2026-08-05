import { useCallback, useEffect, useState } from "react";
import { buscarUsuarioAtual, sairDaContaBackend } from "../../services/api";
import { AbaAtiva, FaseFluxo, TipoLog, UsuarioLogado } from "../types/fluxo";

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
  const [salvarHistoricoAutomaticamente, setSalvarHistoricoAutomaticamente] =
    useState(true);

  const resetarSessaoLocal = useCallback(() => {
    setUsuarioLogado(null);
    setFaseFluxo("landing");
    setAbaAtiva("inicio");
  }, []);

  const iniciarSessao = useCallback(async () => {
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
      resetarSessaoLocal();
      adicionarLog("Nenhuma sessão ativa encontrada.", "info");
    }
  }, [adicionarLog, carregarHistoricoDoBackend, resetarSessaoLocal]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void iniciarSessao();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [iniciarSessao]);

  const handleLoginSucesso = useCallback(
    (nome: string, email: string) => {
      setUsuarioLogado({ nome, email });
      setFaseFluxo("abas");
      setAbaAtiva("inicio");
      adicionarLog(`Acesso autorizado para ${nome}.`, "sucesso");
      void carregarHistoricoDoBackend();
    },
    [adicionarLog, carregarHistoricoDoBackend],
  );

  const handleCadastroSucesso = useCallback(
    (nome: string, email: string) => {
      setUsuarioLogado({ nome, email });
      setFaseFluxo("onboarding");
      adicionarLog(`Novo usuário registrado: ${nome}.`, "sucesso");
    },
    [adicionarLog],
  );

  const handleFinalizarOnboarding = useCallback(() => {
    setFaseFluxo("aviso_medico");
    adicionarLog("Onboarding concluído.", "info");
  }, [adicionarLog]);

  const handleAceitarAvisoMedico = useCallback(() => {
    setFaseFluxo("abas");
    setAbaAtiva("inicio");
    adicionarLog("Aviso médico aceito pelo usuário.", "sucesso");
    void carregarHistoricoDoBackend();
  }, [adicionarLog, carregarHistoricoDoBackend]);

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

  const encerrarSessao = useCallback(async () => {
    try {
      await sairDaContaBackend();
    } catch (error_) {
      console.error("Erro ao encerrar sessão no backend:", error_);
    } finally {
      resetarSessaoLocal();
      adicionarLog("Sessão encerrada.", "info");
    }
  }, [adicionarLog, resetarSessaoLocal]);

  return {
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
  };
}
