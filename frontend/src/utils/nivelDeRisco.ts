export function obterEstiloRisco(nivel: string) {
  const norm = nivel ? nivel.trim().toLowerCase() : "baixo";

  if (norm === "alto") {
    return {
      bg: "bg-red-50 text-red-800 border-red-200",
      badge: "bg-red-600 text-white",
      text: "text-red-600",
      corPrimaria: "#dc2626",
      indicador: "Risco elevado",
      mensagem:
        "Recomenda-se agendar consulta imediata com um dermatologista para avaliação presencial detalhada.",
    };
  }

  if (
    norm === "atenção" ||
    norm === "atencao" ||
    norm === "médio" ||
    norm === "medio"
  ) {
    return {
      bg: "bg-amber-50 text-amber-800 border-amber-200",
      badge: "bg-amber-500 text-white",
      text: "text-amber-600",
      corPrimaria: "#f59e0b",
      indicador: "Atenção / Monitoramento",
      mensagem:
        "Mantenha a lesão sob observação por mudanças. Recomenda-se acompanhamento dermatológico periódico.",
    };
  }

  return {
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    badge: "bg-emerald-600 text-white",
    text: "text-emerald-600",
    corPrimaria: "#059669",
    indicador: "Baixo risco",
    mensagem:
      "O resultado indica baixo nível de atenção visual. Continue acompanhando mudanças na lesão.",
  };
}