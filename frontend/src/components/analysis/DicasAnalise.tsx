import React from 'react';
import { Lightbulb } from 'lucide-react';

const dicas = [
  { titulo: 'Iluminação adequada:', texto: 'Tire a foto em local bem iluminado, de preferência com luz natural direta.' },
  { titulo: 'Foco nítido:', texto: 'A proximidade deve permitir foco limpo na textura da pele. Evite imagens embaçadas.' },
  { titulo: 'Evite interferências:', texto: 'Não cubra a lesão com dedos, cabelos ou sombras, e evite filtros digitais.' },
  { titulo: 'Centralização:', texto: 'Alinhe a pinta principal inteira dentro dos marcadores de enquadramento.' },
];

export const DicasAnalise: React.FC = () => {
  return (
    <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-2xl shadow-xs">
      <div className="flex items-center gap-2 text-teal-850 font-bold mb-2">
        <Lightbulb className="w-4 h-4 text-teal-600 shrink-0" />
        <h4 className="text-xs uppercase tracking-wider">Dicas para uma boa análise</h4>
      </div>
      <ul className="text-[11px] text-teal-950/80 space-y-1.5 leading-relaxed font-medium">
        {dicas.map((dica) => (
          <li key={dica.titulo} className="flex items-start gap-1.5">
            <span className="text-teal-600 mt-0.5">•</span>
            <span><strong>{dica.titulo}</strong> {dica.texto}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};



