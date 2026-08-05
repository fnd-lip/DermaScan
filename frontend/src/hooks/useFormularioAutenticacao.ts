import { FormEvent, useState } from "react";
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
  onCadastroSucesso,
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

  const limparAlertas = () => {
    setErro(null);
    setMensagemEsqueci(null);
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

  const handleRecuperarSenha = (evento: FormEvent) => {
    evento.preventDefault();
    limparAlertas();

    const mensagemValidacao = validarRecuperacaoSenhaFormulario(emailEsquecido);

    if (mensagemValidacao) {
      setErro(mensagemValidacao);
      return;
    }

    setCarregando(true);

    window.setTimeout(() => {
      setCarregando(false);
      setMensagemEsqueci(
        `Um link de redefinição de senha foi enviado para ${emailEsquecido}.`,
      );
    }, 1200);
  };

  const handleSubmit = (evento: FormEvent) => {
    evento.preventDefault();
    limparAlertas();

    if (tipo === "cadastro") {
      void cadastrarUsuario();
      return;
    }

    void autenticarUsuario();
  };

  const cadastrarUsuario = async () => {
    const mensagemValidacao = validarCadastroFormulario({
      nome,
      email,
      senha,
      confirmarSenha,
    });

    if (mensagemValidacao) {
      setErro(mensagemValidacao);
      return;
    }

    try {
      setCarregando(true);

      await cadastrarUsuarioBackend(nome.trim(), email.trim(), senha);

      const respostaLogin = await fazerLoginBackend(email.trim(), senha);

      onCadastroSucesso(
        respostaLogin.usuario.nome,
        respostaLogin.usuario.email,
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
    const mensagemValidacao = validarLoginFormulario({ email, senha });

    if (mensagemValidacao) {
      setErro(mensagemValidacao);
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
