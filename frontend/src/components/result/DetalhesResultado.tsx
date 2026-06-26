import React, { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import type { DetalhesClasseResultado } from "./types";

interface DetalhesResultadoProps {
  detalhesClasse: DetalhesClasseResultado;
}

export const DetalhesResultado: React.FC<DetalhesResultadoProps> = ({
  detalhesClasse,
}) => {
  const [detalhesExpandido, setDetalhesExpandido] = useState(false);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setDetalhesExpandido((valorAtual) => !valorAtual)}
        className="flex w-full items-center justify-between border-b border-slate-200 bg-slate-50 p-3.5 transition-colors hover:bg-slate-100"
        aria-expanded={detalhesExpandido}
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700">
          <Info className="h-4 w-4 text-teal-600" aria-hidden="true" />
          <span>Ver detalhes do resultado</span>
        </div>

        {detalhesExpandido ? (
          <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
        )}
      </button>

      {detalhesExpandido && (
        <div className="space-y-3.5 border-t border-transparent p-4 text-xs leading-relaxed text-slate-600">
          <div>
            <strong className="mb-1 block text-xs text-slate-950">
              Fatores visuais observados:
            </strong>
            <p>{detalhesClasse.sintomas}</p>
          </div>

          <div className="rounded-xl border border-teal-100/70 bg-teal-50/50 p-3.5">
            <strong className="mb-1 block text-xs text-teal-900">
              Orientação recomendada:
            </strong>
            <p className="font-medium text-teal-950">{detalhesClasse.acao}</p>
          </div>

          <div>
            <strong className="mb-1 block text-xs text-slate-950">
              Informação geral:
            </strong>
            <p>{detalhesClasse.detalhe}</p>
          </div>
        </div>
      )}
    </section>
  );
};
