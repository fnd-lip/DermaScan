import React from "react";
import { BookOpen, History } from "lucide-react";

interface AtalhosInicioProps {
  onIrParaHistorico: () => void;
  onIrParaEducacao: () => void;
}

export const AtalhosInicio: React.FC<AtalhosInicioProps> = ({
  onIrParaHistorico,
  onIrParaEducacao,
}) => {
  return (
    <section>
      <h2 className="mb-2.5 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        Atalhos rápidos
      </h2>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={onIrParaHistorico}
          className="group rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-teal-200 hover:shadow-lg hover:shadow-teal-900/10 active:scale-[0.99]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white">
            <History className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-base font-black text-slate-900">
            Ver histórico
          </h3>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            Consulte suas análises salvas e acompanhe laudos anteriores.
          </p>
        </button>

        <button
          type="button"
          onClick={onIrParaEducacao}
          className="group rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-900/10 active:scale-[0.99]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 transition group-hover:bg-indigo-600 group-hover:text-white">
            <BookOpen className="h-5 w-5" />
          </div>

          <h3 className="mt-4 text-base font-black text-slate-900">
            Guia educativo ABCDE
          </h3>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            Revise critérios educativos para reconhecer sinais de atenção.
          </p>
        </button>
      </div>
    </section>
  );
};
