export type TipoFormularioAutenticacao = "login" | "cadastro";

export interface UseFormularioAutenticacaoProps {
  readonly tipoInicial: TipoFormularioAutenticacao;
  readonly onLoginSucesso: (nome: string, email: string) => void;
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
