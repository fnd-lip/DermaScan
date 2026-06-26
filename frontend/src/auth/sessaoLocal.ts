import type { UsuarioAtivoLocal } from "./types";

const CHAVE_USUARIO_ATIVO = "dermascan_user_active";

export function salvarUsuarioAtivoLocal(usuario: UsuarioAtivoLocal) {
  localStorage.setItem(CHAVE_USUARIO_ATIVO, JSON.stringify(usuario));
}