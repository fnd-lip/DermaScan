import React from "react";
import { Check, RefreshCw, Save } from "lucide-react";

interface AcoesResultadoProps {
  salvo: boolean;
  onNovaAnalise: () => void;
  onSalvarNoHistorico: () => void;
}

export const AcoesResultado: React.FC<AcoesResultadoProps> = ({
  salvo,
  onNovaAnalise,
  onSalvarNoHistorico,
}) => {
  return (
    <footer className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={onNovaAnalise}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm transition-all hover:bg-slate-50"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Nova análise
      </button>

      <button
        type="button"
        onClick={onSalvarNoHistorico}
        disabled={salvo}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-3 text-sm font-black text-white shadow-sm shadow-teal-900/10 transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-emerald-600"
      >
        {salvo ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Save className="h-4 w-4" aria-hidden="true" />
        )}

        {salvo ? "Salvo no histórico" : "Salvar no histórico"}
      </button>
    </footer>
  );
};
