export function normalizarClasseDermatologica(classe?: string | null): string {
  if (!classe) return 'Classe não informada';

  const classeLimpa = classe.trim();
  const chave = classeLimpa.toLowerCase();

  const correcoes: Record<string, string> = {
    melanoma: 'Melanoma',

    'carcinoma basocelular': 'Carcinoma basocelular',

    'ceratose actínica': 'Ceratose actínica',
    'ceratose act??nica': 'Ceratose actínica',
    'ceratose act?nica': 'Ceratose actínica',
    'ceratose actinica': 'Ceratose actínica',

    'nevo melanocítico': 'Nevo melanocítico',
    'nevo melano??tico': 'Nevo melanocítico',
    'nevo melanoc??tico': 'Nevo melanocítico',
    'nevo melanocitico': 'Nevo melanocítico',

    'ceratose benigna': 'Ceratose benigna',

    dermatofibroma: 'Dermatofibroma',

    'lesão vascular': 'Lesão vascular',
    'les??o vascular': 'Lesão vascular',
    'lesao vascular': 'Lesão vascular',

    outros: 'Outros',
    'outros / benignos': 'Outros / benignos',
  };

  return correcoes[chave] ?? classeLimpa;
}