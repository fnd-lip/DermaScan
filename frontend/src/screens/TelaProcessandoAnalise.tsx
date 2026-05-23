import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Cpu, Database, Search } from 'lucide-react';

interface TelaProcessandoAnaliseProps {
  onFinalizarProcessamento: () => void;
}

export const TelaProcessandoAnalise: React.FC<TelaProcessandoAnaliseProps> = ({ onFinalizarProcessamento }) => {
  const [etapa, setEtapa] = useState(0);
  const [progresso, setProgresso] = useState(0);

  const etapas = [
    { label: "Preparando imagem e ajustando contraste...", icone: <Search className="w-5 h-5 text-teal-500" /> },
    { label: "Executando modelo de Deep Learning (CNN)...", icone: <Cpu className="w-5 h-5 text-indigo-500" /> },
    { label: "Buscando similaridades e gerando resultado...", icone: <Database className="w-5 h-5 text-emerald-500" /> }
  ];

  useEffect(() => {
    // Progress increment
    const intervalProgresso = setInterval(() => {
      setProgresso(prev => {
        if (prev >= 100) {
          clearInterval(intervalProgresso);
          return 100;
        }
        return prev + 1;
      });
    }, 45);

    // Step sequence changes every 1.5 seconds
    const intervalEtapa = setInterval(() => {
      setEtapa(prev => {
        if (prev < etapas.length - 1) {
          return prev + 1;
        } else {
          clearInterval(intervalEtapa);
          return prev;
        }
      });
    }, 1500);

    return () => {
      clearInterval(intervalProgresso);
      clearInterval(intervalEtapa);
    };
  }, []);

  useEffect(() => {
    if (progresso >= 100) {
      const timeout = setTimeout(() => {
        onFinalizarProcessamento();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progresso, onFinalizarProcessamento]);

  return (
    <div className="flex flex-col items-center justify-between h-full bg-slate-950 text-white p-6 justify-center text-center font-sans select-none">
      
      {/* Invisible spacer */}
      <div />

      <div className="flex flex-col items-center gap-6">
        {/* Animated outer ring spinner with deep learning core icon */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
            className="absolute inset-0 border-4 border-t-teal-400 border-r-teal-500/10 border-b-indigo-500/20 border-l-teal-400 rounded-full"
          />
          <Cpu className="w-10 h-10 text-teal-400 animate-pulse" />
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-teal-400 font-mono">Processando Análise</h3>
          <p className="text-[11px] text-gray-400 mt-1 font-mono">Rede Convolucional Ativa</p>
        </div>

        {/* Dynamic loading step tracker */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl min-w-[260px] max-w-xs flex items-center gap-3 shadow-md">
          <div className="animate-spin shrink-0">
            <RefreshCw className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-gray-200">
              {etapas[etapa].label}
            </p>
            <p className="text-[9px] text-gray-500 uppercase font-mono mt-0.5">Fase {etapa + 1} de {etapas.length}</p>
          </div>
        </div>
      </div>

      {/* Progress display bar */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2 mb-8">
        <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-linear-to-r from-teal-400 to-indigo-400 rounded-full transition-all duration-75"
            style={{ width: `${progresso}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 font-mono tracking-wider">{progresso}% concluído</span>
      </div>

    </div>
  );
};



