export function obterIniciaisUsuario(nome: string): string {
  return nome
    .split(' ')
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}



