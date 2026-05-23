export function obterEstiloRisco(nivel: string) {
  const norm = nivel ? nivel.trim().toLowerCase() : 'baixo';
  if (norm === 'alto') {
    return {
      bg: 'bg-red-50 text-red-800 border-red-200',
      badge: 'bg-red-600 text-white',
      text: 'text-red-600',
      corPrimaria: '#dc2626',
      indicador: 'ðŸ”´ Risco Elevado',
      mensagem: 'Recomenda-se agendar consulta imediata com um dermatologista para avaliação presencial detalhada.'
    };
  } else if (norm === 'atenção' || norm === 'atencao' || norm === 'médio' || norm === 'medio') {
    return {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      badge: 'bg-amber-500 text-white',
      text: 'text-amber-600',
      corPrimaria: '#f59e0b',
      indicador: 'ðŸŸ¡ Atenção / Monitoramento',
      mensagem: 'Mantenha a lesão sob observação por mudanças. Recomenda-se acompanhamento dermatológico periódico.'
    };
  } else {
    return {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badge: 'bg-emerald-600 text-white',
      text: 'text-emerald-600',
      corPrimaria: '#10b981',
      indicador: 'ðŸŸ¢ Baixo Risco',
      mensagem: 'Aparenta características benignas. Se houver mudanças lentas ou dúvidas, consulte seu médico.'
    };
  }
}



