import React from 'react';
import { Predicao } from '../../types/Predicao';
import { obterEstiloRisco } from '../../utils/nivelDeRisco';
import { formatarPorcentagem } from '../../utils/formatarPorcentagem';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface CartaoResultadoProps {
  predicao: Predicao;
}

export const CartaoResultado: React.FC<CartaoResultadoProps> = ({ predicao }) => {
  const estilo = obterEstiloRisco(predicao.nivelAtencao);
  
  const getIcon = () => {
    switch (predicao.nivelAtencao) {
      case 'Alto':
        return <ShieldAlert className="w-6 h-6 text-red-600" />;
      case 'Atenção':
        return <AlertCircle className="w-6 h-6 text-amber-500" />;
      case 'Baixo':
      default:
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className={`p-4 border rounded-2xl ${estilo.bg} transition-all duration-300 shadow-sm border-gray-100`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-0.5">Classe mais provável</p>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {predicao.classePrevista}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs font-medium px-2.5 py-0.5 bg-white/90 text-gray-800 rounded-full border border-gray-200 inline-block font-mono">
              Confiança: <span className="font-bold">{formatarPorcentagem(predicao.confianca)}</span>
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-block ${estilo.badge}`}>
              Atenção: {predicao.nivelAtencao}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-3.5 pt-3 border-t border-gray-200/60 text-xs text-gray-700 leading-relaxed">
        <strong>Semelhança visual:</strong> A imagem analisada apresenta maior semelhança clínica com a classe <strong>{predicao.classePrevista}</strong> de acordo com o modelo computacional de Deep Learning.
      </div>
    </div>
  );
};



