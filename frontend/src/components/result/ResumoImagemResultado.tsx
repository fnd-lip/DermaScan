import React from "react";
import type { Predicao } from "../../types/Predicao";
import { normalizarClasseDermatologica } from "../../utils/normalizarClasseDermatologica";

interface ResumoImagemResultadoProps {
  predicao: Predicao;
  imagemUri: string;
}

export const ResumoImagemResultado: React.FC<ResumoImagemResultadoProps> = ({
  predicao,
  imagemUri,
}) => {
  return (
    <section className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200">
        <img
          src={imagemUri}
          alt="Imagem analisada"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="min-w-0">
        <span className="block font-mono text-[10px] uppercase text-slate-400">
          Análise de registro
        </span>

        <span className="block max-w-48 truncate text-xs font-bold leading-snug text-slate-800">
          {normalizarClasseDermatologica(predicao.classePrevista)}
        </span>

        <span className="mt-0.5 inline-block rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] text-slate-600">
          {predicao.dataAnalise || "Visualizado agora"}
        </span>
      </div>
    </section>
  );
};
