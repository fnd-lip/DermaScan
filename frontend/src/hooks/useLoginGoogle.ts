import { useState } from "react";
import { normalizarMensagemErro } from "../auth/normalizarErro";
import { salvarUsuarioAtivoLocal } from "../auth/sessaoLocal";
import { fazerLoginGoogleBackend } from "../services/api";

type LoginSucesso = (nome: string, email: string) => void;

export function useLoginGoogle(onLoginSucesso: LoginSucesso) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const autenticarGoogle = async (credential: string) => {
    if (carregando) return;

    setErro(null);
    setCarregando(true);

    try {
      const resposta = await fazerLoginGoogleBackend(credential);

      const usuarioAtivo = {
        nome: resposta.usuario.nome,
        email: resposta.usuario.email,
      };

      salvarUsuarioAtivoLocal(usuarioAtivo);
      onLoginSucesso(usuarioAtivo.nome, usuarioAtivo.email);
    } catch (error_) {
      setErro(
        normalizarMensagemErro(error_, "Não foi possível entrar com Google."),
      );
    } finally {
      setCarregando(false);
    }
  };

  const informarErroGoogle = () => {
    setErro("Não foi possível autenticar com Google. Tente novamente.");
  };

  return {
    carregando,
    erro,
    autenticarGoogle,
    informarErroGoogle,
  };
}
