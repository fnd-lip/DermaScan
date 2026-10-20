import { useState, type SyntheticEvent } from "react";
import { cadastrarUsuarioBackend, fazerLoginBackend } from "../services/api";
import { normalizarMensagemErro } from "../auth/normalizarErro";
import { salvarUsuarioAtivoLocal } from "../auth/sessaoLocal";
import type {
  TipoFormularioAutenticacao,
  UseFormularioAutenticacaoProps,
} from "../auth/types";
import {
  validarCadastroFormulario,
  validarLoginFormulario,
  validarRecuperacaoSenhaFormulario,
} from "../auth/validacoesFormulario";

export function useFormularioAutenticacao({
  tipoInicial,
  onLoginSucesso,
}: UseFormularioAutenticacaoProps) {
  const [tipo, setTipo] = useState<TipoFormularioAutenticacao>(tipoInicial);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [modoEsqueciSenha, setModoEsqueciSenha] = useState(false);
  const [emailEsquecido, setEmailEsquecido] = useState("");
  const [mensagemEsqueci, setMensagemEsqueci] = useState<string | null>(null);
  const [mensagemCadastro, setMensagemCadastro] = useState<string | null>(null);

  const limparAlertas = () => {
    setErro(null);
    setMensagemEsqueci(null);
    setMensagemCadastro(null);
  };

  const alternarTipo = (novoTipo: TipoFormularioAutenticacao) => {
    setTipo(novoTipo);
    limparAlertas();
  };

  const abrirRecuperacaoSenha = () => {
    setModoEsqueciSenha(true);
    limparAlertas();
  };

  const voltarParaLogin = () => {
    setModoEsqueciSenha(false);
    limparAlertas();
  };

  const handleRecuperarSenha = (evento: SyntheticEvent<Element>) => {
    evento.preventDefault();
    limparAlertas();

    const mensagem = validarRecuperacaoSenhaFormulario(emailEsquecido);

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    setErro("A recuperação de senha ainda não está disponível.");
  };

  const cadastrarUsuario = async () => {
    const mensagem = validarCadastroFormulario({
      nome,
      email,
      senha,
      confirmarSenha,
    });

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    try {
      setCarregando(true);
      await cadastrarUsuarioBackend(nome.trim(), email.trim(), senha);

      setEmail(email.trim());
      setSenha("");
      setConfirmarSenha("");
      setMostrarSenha(false);
      setTipo("login");
      setMensagemCadastro(
        "Conta criada com sucesso! Entre com seu e-mail e senha.",
      );
    } catch (error_) {
      setErro(
        normalizarMensagemErro(error_, "Não foi possível cadastrar o usuário."),
      );
    } finally {
      setCarregando(false);
    }
  };

  const autenticarUsuario = async () => {
    const mensagem = validarLoginFormulario({ email, senha });

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    try {
      setCarregando(true);
      const resposta = await fazerLoginBackend(email.trim(), senha);

      const usuarioAtivo = {
        nome: resposta.usuario.nome,
        email: resposta.usuario.email,
      };

      salvarUsuarioAtivoLocal(usuarioAtivo);
      onLoginSucesso(usuarioAtivo.nome, usuarioAtivo.email);
    } catch (error_) {
      setErro(normalizarMensagemErro(error_, "E-mail ou senha inválidos."));
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = (evento: SyntheticEvent<Element>) => {
    evento.preventDefault();
    limparAlertas();

    if (carregando) return;

    if (tipo === "cadastro") {
      void cadastrarUsuario();
      return;
    }

    void autenticarUsuario();
  };

  return {
    tipo,
    nome,
    email,
    senha,
    confirmarSenha,
    mostrarSenha,
    erro,
    carregando,
    modoEsqueciSenha,
    emailEsquecido,
    mensagemEsqueci,
    mensagemCadastro,
    setNome,
    setEmail,
    setSenha,
    setConfirmarSenha,
    setMostrarSenha,
    setEmailEsquecido,
    alternarTipo,
    abrirRecuperacaoSenha,
    voltarParaLogin,
    handleSubmit,
    handleRecuperarSenha,
  };
}
