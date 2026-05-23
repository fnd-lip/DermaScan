import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';

interface AlertaAutenticacaoProps {
  erro: string | null;
  mensagemEsqueci: string | null;
}

export const AvisoClinicoAutenticacao: React.FC = () => {
  return (
    <div className="mb-5 px-3 py-2 bg-amber-50/80 border border-amber-200/60 rounded-xl flex gap-2 items-center text-[10px] text-amber-800 font-semibold">
      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      <span>Aviso: O diagnóstico da IA necessita de avaliação presencial.</span>
    </div>
  );
};

export const AlertaAutenticacao: React.FC<AlertaAutenticacaoProps> = ({
  erro,
  mensagemEsqueci,
}) => {
  if (erro) {
    return (
      <div className="mb-5 p-3.5 bg-red-50 border border-red-150 rounded-2xl flex gap-2.5 items-start text-xs text-red-700 animate-fadeIn">
        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
        <span>{erro}</span>
      </div>
    );
  }

  if (mensagemEsqueci) {
    return (
      <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-150 rounded-2xl flex gap-2.5 items-start text-xs text-emerald-800 animate-fadeIn">
        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">✓</div>
        <span>{mensagemEsqueci}</span>
      </div>
    );
  }

  return null;
};



