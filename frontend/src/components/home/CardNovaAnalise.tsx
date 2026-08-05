import React from "react";
import { ArrowRight, Camera, Sparkles } from "lucide-react";

interface CardNovaAnaliseProps {
  onIrParaAnalise: () => void;
}

export const CardNovaAnalise: React.FC<CardNovaAnaliseProps> = ({
  onIrParaAnalise,
}) => {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] bg-linear-to-br from-teal-600 via-teal-700 to-emerald-800 p-6 text-white shadow-xl shadow-teal-900/15">
      <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-10 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />

      <div className="relative flex items-start justify-between gap-5">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-teal-50">
            <Sparkles className="h-3.5 w-3.5" />
            Análise assistida por IA
          </span>

          <h2 className="mt-4 text-xl font-black tracking-tight text-white lg:text-2xl">
            Nova análise dermatológica
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-50/90">
            Envie uma imagem ou tire uma foto da lesão para iniciar a
            classificação assistida por inteligência artificial.
          </p>

          <button
            type="button"
            onClick={onIrParaAnalise}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-teal-800 shadow-lg shadow-teal-950/15 transition hover:-translate-y-0.5 hover:bg-teal-50 active:translate-y-0"
          >
            <Camera className="h-4 w-4" />
            Analisar agora
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/15 text-teal-50 md:flex">
          <Camera className="h-6 w-6" />
        </div>
      </div>
    </section>
  );
};
