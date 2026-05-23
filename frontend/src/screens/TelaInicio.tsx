import React from 'react';
import { Camera, Calendar, History, BookOpen, AlertCircle } from 'lucide-react';
import { Predicao } from '../types/Predicao';
import { formatarPorcentagem } from '../utils/formatarPorcentagem';
import { obterEstiloRisco } from '../utils/nivelDeRisco';

interface TelaInicioProps {
  onIrParaAnalise: () => void;
  onIrParaHistorico: () => void;
  onIrParaEducacao: () => void;
  ultimaAnalise: Predicao | null;
  onVerDetalhesUltima: (analise: Predicao) => void;
  nomeUsuario?: string;
}

export const TelaInicio: React.FC<TelaInicioProps> = ({
  onIrParaAnalise,
  onIrParaHistorico,
  onIrParaEducacao,
  ultimaAnalise,
  onVerDetalhesUltima,
  nomeUsuario = 'Felipe'
}) => {
  const estiloRisco = ultimaAnalise ? obterEstiloRisco(ultimaAnalise.nivelAtencao) : null;

  return (
    <div className="flex flex-col h-full bg-slate-50 text-gray-800 p-5 overflow-y-auto space-y-5 font-sans pb-20 select-none">
      <div>
        <h4 className="text-xs text-teal-600 font-bold uppercase tracking-wider">Painel Clínico</h4>
        <h2 className="text-xl font-bold text-gray-900 mt-1">
          Olá, {nomeUsuario.split(' ')[0]}.
        </h2>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
          Vamos classificar uma lesão dermatológica hoje?
        </p>
      </div>

      <div className="bg-linear-to-br from-teal-600 to-teal-800 text-white rounded-2xl p-4.5 shadow-md shadow-teal-700/10 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] bg-teal-500/40 text-teal-100 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block font-mono border border-teal-400/20">
              Rede Convolucional
            </span>
            <h3 className="font-bold text-base mt-1.5 leading-snug">Nova Análise Dermatológica</h3>
          </div>
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-teal-200">
            <Camera className="w-5 h-5" />
          </div>
        </div>
        <p className="text-xs text-teal-100 leading-relaxed font-light">
          Envie uma imagem ou tire uma foto da lesão para iniciar a classificação automatizada por inteligência artificial.
        </p>
        <button
          onClick={onIrParaAnalise}
          className="mt-1 w-full py-2.5 px-4 bg-white text-teal-800 font-bold rounded-xl text-xs hover:bg-teal-50 active:bg-teal-100 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          Analisar Agora
        </button>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2.5">Última Análise Realizada</h3>
        {ultimaAnalise ? (
          <div
            onClick={() => onVerDetalhesUltima(ultimaAnalise)}
            className="bg-white border border-gray-100 rounded-2xl p-3.5 flex gap-3 items-center hover:border-teal-200 shadow-sm transition-all duration-200 cursor-pointer group"
          >
            <div className="w-14 h-14 bg-slate-105 rounded-xl border border-gray-150 overflow-hidden relative shrink-0">
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
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${estiloRisco?.badge}`}>
                  {ultimaAnalise.nivelAtencao}
                </span>
              </div>
              
              <div className="flex items-center gap-3.5 text-[11px] text-gray-400 mt-1">
                <span>Confiança: <strong className="font-mono text-gray-600 font-bold">{formatarPorcentagem(ultimaAnalise.confianca)}</strong></span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {ultimaAnalise.dataAnalise || 'Hoje'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-gray-250 bg-gray-50 rounded-2xl p-4.5 text-center flex flex-col items-center justify-center gap-1">
            <AlertCircle className="w-6 h-6 text-gray-400 mb-1" />
            <p className="text-xs font-semibold text-gray-500">Nenhuma análise anterior registrada</p>
            <p className="text-[10px] text-gray-400 leading-relaxed px-4">Tire sua primeira foto e teste a classificação neural.</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2.5">Atalhos Rápidos</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onIrParaHistorico}
            className="bg-white hover:bg-slate-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2 group transition-all duration-200 active:scale-[0.98] shadow-xs"
          >
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
              <History className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-700">Ver Histórico</span>
            <p className="text-[10px] text-gray-400">Suas análises salvas</p>
          </button>

          <button
            onClick={onIrParaEducacao}
            className="bg-white hover:bg-slate-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center gap-2 group transition-all duration-200 active:scale-[0.98] shadow-xs"
          >
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-700">Aprender Guia</span>
            <p className="text-[10px] text-gray-400">Regra ABCDE e mais</p>
          </button>
        </div>
      </div>
    </div>
  );
};



