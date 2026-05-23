import React from 'react';
import { formatarPorcentagem } from '../../utils/formatarPorcentagem';

interface BarraProbabilidadeProps {
  classe: string;
  probabilidade: number;
  destacar?: boolean;
}

export const BarraProbabilidade: React.FC<BarraProbabilidadeProps> = ({
  classe,
  probabilidade,
  destacar = false
}) => {
  const pct = Math.round((probabilidade > 1 ? probabilidade / 100 : probabilidade) * 100);

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center text-xs mb-1.5">
        <span className={`font-medium ${destacar ? 'text-teal-950 font-bold' : 'text-gray-700'}`}>
          {classe}
        </span>
        <span className={`font-mono text-xs ${destacar ? 'text-teal-700 font-bold' : 'text-gray-500'}`}>
          {formatarPorcentagem(probabilidade)}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${destacar ? 'bg-linear-to-r from-teal-500 to-teal-600' : 'bg-gray-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};



