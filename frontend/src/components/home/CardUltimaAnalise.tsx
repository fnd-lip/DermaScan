import React from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import { Predicao } from '../../types/Predicao';
import { formatarPorcentagem } from '../../utils/formatarPorcentagem';
import { obterEstiloRisco } from '../../utils/nivelDeRisco';

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
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2.5">
        Última Análise Realizada
      </h3>

      {ultimaAnalise ? (
        <div
          onClick={() => onVerDetalhesUltima(ultimaAnalise)}
          className="bg-white border border-gray-100 rounded-2xl p-3.5 flex gap-3 items-center hover:border-teal-200 shadow-sm transition-all duration-200 cursor-pointer group"
        >
          <div className="w-14 h-14 bg-slate-100 rounded-xl border border-gray-100 overflow-hidden relative shrink-0">
            {ultimaAnalise.imagemUri ? (
              <img
                src={ultimaAnalise.imagemUri}
                alt="Lesão anterior"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-xs">
                DS
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-gray-800 truncate block">
                {ultimaAnalise.classePrevista}
              </span>

              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${estiloRisco?.badge}`}
              >
                {ultimaAnalise.nivelAtencao}
              </span>
            </div>

            <div className="flex items-center gap-3.5 text-[11px] text-gray-400 mt-1">
              <span>
                Confiança:{' '}
                <strong className="font-mono text-gray-600 font-bold">
                  {formatarPorcentagem(ultimaAnalise.confianca)}
                </strong>
              </span>

              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {ultimaAnalise.dataAnalise || 'Hoje'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-gray-250 bg-gray-50 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-1.5">
          <AlertCircle className="w-6 h-6 text-gray-400 mb-1" />

          <p className="text-xs font-semibold text-gray-500">
            Nenhuma análise anterior registrada
          </p>

          <p className="text-[10px] text-gray-400 leading-relaxed px-4">
            Faça sua primeira análise para acompanhar os resultados por aqui.
          </p>

          <button
            type="button"
            onClick={onIrParaAnalise}
            className="mt-1 text-[11px] font-bold text-teal-700 hover:text-teal-800"
          >
            Começar agora
          </button>
        </div>
      )}
    </div>
  );
};