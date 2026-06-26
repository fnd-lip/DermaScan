import type { DadosCadastroFormulario, DadosLoginFormulario } from "./types";

export function validarEmail(valor: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

export function validarCadastroFormulario({
  nome,
  email,
  senha,
  confirmarSenha,
}: DadosCadastroFormulario) {
  if (!nome.trim()) {
    return "Por favor, informe seu nome completo.";
  }

  if (!email.trim() || !validarEmail(email)) {
    return "Por favor, informe um e-mail válido.";
  }

  if (senha.length < 6) {
    return "A senha deve conter pelo menos 6 caracteres.";
  }

  if (senha !== confirmarSenha) {
    return "As senhas digitadas não coincidem.";
  }

  return null;
}

export function validarLoginFormulario({ email, senha }: DadosLoginFormulario) {
  if (!email.trim() || !validarEmail(email)) {
    return "Por favor, informe um e-mail válido.";
  }

  if (!senha) {
    return "Por favor, digite sua senha.";
  }

  return null;
}

export function validarRecuperacaoSenhaFormulario(email: string) {
  if (!email.trim() || !validarEmail(email)) {
    return "Por favor, informe seu e-mail cadastrado.";
  }

  return null;
}
