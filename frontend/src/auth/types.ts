export type TipoFormularioAutenticacao = "login" | "cadastro";

export interface UseFormularioAutenticacaoProps {
  tipoInicial: TipoFormularioAutenticacao;
  onLoginSucesso: (nome: string, email: string) => void;
  onCadastroSucesso: (nome: string, email: string) => void;
}

export interface DadosCadastroFormulario {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface DadosLoginFormulario {
  email: string;
  senha: string;
}

export interface UsuarioAtivoLocal {
  nome: string;
  email: string;
}