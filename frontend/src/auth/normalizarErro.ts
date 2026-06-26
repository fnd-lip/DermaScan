export function normalizarMensagemErro(erro: unknown, mensagemPadrao: string) {
  return erro instanceof Error ? erro.message : mensagemPadrao;
}