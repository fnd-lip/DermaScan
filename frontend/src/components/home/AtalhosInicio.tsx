import React from 'react';
import { BookOpen, History } from 'lucide-react';

interface AtalhosInicioProps {
  onIrParaHistorico: () => void;
  onIrParaEducacao: () => void;
}

export const AtalhosInicio: React.FC<AtalhosInicioProps> = ({
  onIrParaHistorico,
  onIrParaEducacao,
}) => {
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2.5">
        Atalhos Rápidos
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onIrParaHistorico}
          className="bg-white hover:bg-slate-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2 group transition-all duration-200 active:scale-[0.98] shadow-xs"
        >
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
            <History className="w-5 h-5" />
          </div>

          <span className="text-xs font-bold text-gray-700">
            Ver Histórico
          </span>

          <p className="text-[10px] text-gray-400">
            Suas análises salvas
          </p>
        </button>

        <button
          onClick={onIrParaEducacao}
          className="bg-white hover:bg-slate-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2 group transition-all duration-200 active:scale-[0.98] shadow-xs"
        >
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>

          <span className="text-xs font-bold text-gray-700">
            Aprender Guia
          </span>

          <p className="text-[10px] text-gray-400">
            Regra ABCDE e mais
          </p>
        </button>
      </div>
    </div>
  );
};