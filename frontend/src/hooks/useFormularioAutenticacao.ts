import { FormEvent, useState } from "react";
import { cadastrarUsuarioBackend, fazerLoginBackend } from "../services/api";

interface UseFormularioAutenticacaoProps {
  tipoInicial: "login" | "cadastro";
  onLoginSucesso: (nome: string, email: string) => void;
  onCadastroSucesso: (nome: string, email: string) => void;
}

function validarEmail(valor: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

export function useFormularioAutenticacao({
  tipoInicial,
  onLoginSucesso,
  onCadastroSucesso,
}: UseFormularioAutenticacaoProps) {
  const [tipo, setTipo] = useState<"login" | "cadastro">(tipoInicial);
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

  const alternarTipo = (novoTipo: "login" | "cadastro") => {
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

    if (!emailEsquecido.trim() || !validarEmail(emailEsquecido)) {
      setErro("Por favor, informe seu e-mail cadastrado.");
      return;
    }

    setCarregando(true);

    setTimeout(() => {
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
    if (!nome.trim()) {
      setErro("Por favor, informe seu nome completo.");
      return;
    }

    if (!email.trim() || !validarEmail(email)) {
      setErro("Por favor, informe um e-mail válido.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve conter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas digitadas não coincidem.");
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
    } catch (erro) {
      const mensagemErro =
        erro instanceof Error
          ? erro.message
          : "Não foi possível cadastrar o usuário.";

      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };
  
  const autenticarUsuario = async () => {
    if (!email.trim() || !validarEmail(email)) {
      setErro("Por favor, informe um e-mail válido.");
      return;
    }

    if (!senha) {
      setErro("Por favor, digite sua senha.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fazerLoginBackend(email.trim(), senha);

      const usuarioAtivo = {
        nome: resposta.usuario.nome,
        email: resposta.usuario.email,
      };

      localStorage.setItem(
        "dermascan_user_active",
        JSON.stringify(usuarioAtivo),
      );

      onLoginSucesso(usuarioAtivo.nome, usuarioAtivo.email);
    } catch (erro) {
      const mensagemErro =
        erro instanceof Error ? erro.message : "E-mail ou senha inválidos.";

      setErro(mensagemErro);
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
