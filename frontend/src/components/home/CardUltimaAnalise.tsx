import React from "react";
import { AlertCircle, Calendar, ChevronRight } from "lucide-react";
import { Predicao } from "../../types/Predicao";
import { formatarPorcentagem } from "../../utils/formatarPorcentagem";
import { obterEstiloRisco } from "../../utils/nivelDeRisco";

interface CardUltimaAnaliseProps {
  ultimaAnalise: Predicao | null;
  onVerDetalhesUltima: (analise: Predicao) => void;
  onIrParaAnalise: () => void;
}

export const CardUltimaAnalise: React.FC<CardUltimaAnaliseProps> = ({
  ultimaAnalise,
  onVerDetalhesUltima,
  onIrParaAnalise,
}) => {
  const estiloRisco = ultimaAnalise
    ? obterEstiloRisco(ultimaAnalise.nivelAtencao)
    : null;

  return (
    <section>
      <h2 className="mb-2.5 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        Última análise realizada
      </h2>

      {ultimaAnalise ? (
        <button
          type="button"
          onClick={() => onVerDetalhesUltima(ultimaAnalise)}
          className="group flex w-full items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-teal-200 hover:shadow-lg hover:shadow-teal-900/10"
        >
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {ultimaAnalise.imagemUri ? (
              <img
                src={ultimaAnalise.imagemUri}
                alt="Lesão anterior"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-teal-50 text-sm font-black text-teal-700">
                DS
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-black text-slate-900">
                {ultimaAnalise.classePrevista}
              </h3>

              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-black ${estiloRisco?.badge}`}
              >
                {ultimaAnalise.nivelAtencao}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>
                Confiança:{" "}
                <strong className="font-mono font-black text-slate-800">
                  {formatarPorcentagem(ultimaAnalise.confianca)}
                </strong>
              </span>

              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {ultimaAnalise.dataAnalise || "Hoje"}
              </span>
            </div>
          </div>

          <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600" />
        </button>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <AlertCircle className="h-6 w-6" />
          </div>

          <h3 className="mt-4 text-base font-black text-slate-800">
            Nenhuma análise anterior registrada
          </h3>

          <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-slate-500">
            Faça sua primeira análise para acompanhar os resultados por aqui.
          </p>

          <button
            type="button"
            onClick={onIrParaAnalise}
            className="mt-4 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-black text-teal-700 transition hover:bg-teal-50 hover:text-teal-900"
          >
            Começar agora
          </button>
        </div>
      )}
    </section>
  );
};