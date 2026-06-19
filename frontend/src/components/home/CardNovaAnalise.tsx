import React from 'react';
import { Camera } from 'lucide-react';

interface CardNovaAnaliseProps {
  onIrParaAnalise: () => void;
}

export const CardNovaAnalise: React.FC<CardNovaAnaliseProps> = ({
  onIrParaAnalise,
}) => {
  return (
    <div className="bg-linear-to-br from-teal-600 to-teal-800 text-white rounded-2xl p-5 shadow-md shadow-teal-700/10 flex flex-col gap-3">
      <div className="flex justify-between items-start gap-4">
        <div>
          <span className="text-[10px] bg-teal-500/40 text-teal-100 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block font-mono border border-teal-400/20">
            Análise assistida por IA
          </span>

          <h3 className="font-bold text-base mt-1.5 leading-snug">
            Nova Análise Dermatológica
          </h3>
        </div>

        <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-teal-200">
          <Camera className="w-5 h-5" />
        </div>
      </div>

      <p className="text-xs text-teal-100 leading-relaxed font-light max-w-3xl">
        Envie uma imagem ou tire uma foto da lesão para iniciar a classificação assistida por inteligência artificial.
      </p>

      <button
        onClick={onIrParaAnalise}
        className="mt-1 w-fit min-w-44 py-2.5 px-5 bg-white text-teal-800 font-bold rounded-xl text-xs hover:bg-teal-50 active:bg-teal-100 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-sm"
      >
        <Camera className="w-4 h-4" />
        Analisar agora
      </button>
    </div>
  );
};