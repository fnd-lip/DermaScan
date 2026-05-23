import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const CartaoAvisoMedico: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-900 shadow-sm leading-relaxed">
      <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 mb-1">Aviso Médico de Isenção</h4>
        <p className="text-xs text-amber-950 leading-relaxed">
          Este resultado é apenas uma estimativa feita por algoritmos de inteligência artificial de aprendizado profundo (Deep Learning) e <strong>não substitui em hipótese alguma uma consulta médica ou um diagnóstico dermatológico presencial.</strong>
        </p>
        <p className="text-xs text-amber-850 mt-1.5 font-medium">
          Caso observe crescimento rápido, sangramento, alteração de cor, dor, coceira ou bordas irregulares na lesão, procure imediatamente assistência profissional.
        </p>
      </div>
    </div>
  );
};



