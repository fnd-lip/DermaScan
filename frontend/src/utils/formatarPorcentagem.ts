export function formatarPorcentagem(valor: number): string {
  if (valor === undefined || valor === null) return '0%';
  // Caso venha numa escala de 0 a 100 ao invés de 0 a 1
  const num = valor > 1 ? valor : valor * 100;
  return `${Math.round(num)}%`;
}



