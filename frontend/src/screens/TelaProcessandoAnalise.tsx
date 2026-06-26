import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { RefreshCw, Cpu, Database, Search } from "lucide-react";

interface TelaProcessandoAnaliseProps {
  onFinalizarProcessamento: () => void;
}

const etapasProcessamento = [
  {
    label: "Preparando imagem e ajustando contraste...",
    icone: <Search className="w-5 h-5 text-teal-500" />,
  },
  {
    label: "Executando análise assistida por IA...",
    icone: <Cpu className="w-5 h-5 text-indigo-500" />,
  },
  {
    label: "Buscando similaridades e gerando resultado...",
    icone: <Database className="w-5 h-5 text-emerald-500" />,
  },
];

export const TelaProcessandoAnalise: React.FC<TelaProcessandoAnaliseProps> = ({
  onFinalizarProcessamento,
}) => {
  const [etapa, setEtapa] = useState(0);
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const intervalProgresso = window.setInterval(() => {
      setProgresso((progressoAtual) => {
        if (progressoAtual >= 100) {
          window.clearInterval(intervalProgresso);
          return 100;
        }

        return progressoAtual + 1;
      });
    }, 45);

    const intervalEtapa = window.setInterval(() => {
      setEtapa((etapaAtual) => {
        if (etapaAtual < etapasProcessamento.length - 1) {
          return etapaAtual + 1;
        }

        window.clearInterval(intervalEtapa);
        return etapaAtual;
      });
    }, 1500);

    return () => {
      window.clearInterval(intervalProgresso);
      window.clearInterval(intervalEtapa);
    };
  }, []);

  useEffect(() => {
    if (progresso < 100) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onFinalizarProcessamento();
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [progresso, onFinalizarProcessamento]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-950 text-white p-6 text-center font-sans select-none">
      <div />

      <div className="flex flex-col items-center gap-6">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
            className="absolute inset-0 border-4 border-t-teal-400 border-r-teal-500/10 border-b-indigo-500/20 border-l-teal-400 rounded-full"
          />

          <Cpu className="w-10 h-10 text-teal-400 animate-pulse" />
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-widest uppercase text-teal-400 font-mono">
            Processando Análise
          </h3>

          <p className="text-[11px] text-gray-400 mt-1 font-mono">
            Rede Convolucional Ativa
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl min-w-65 max-w-xs flex items-center gap-3 shadow-md">
          <div className="animate-spin shrink-0">
            <RefreshCw className="w-4 h-4 text-teal-400" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              {etapasProcessamento[etapa].icone}

              <p className="text-xs font-semibold text-gray-200">
                {etapasProcessamento[etapa].label}
              </p>
            </div>

            <p className="text-[9px] text-gray-500 uppercase font-mono mt-0.5">
              Fase {etapa + 1} de {etapasProcessamento.length}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xs flex flex-col items-center gap-2 mb-8">
        <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-linear-to-r from-teal-400 to-indigo-400 rounded-full transition-all duration-75"
            style={{ width: `${progresso}%` }}
          />
        </div>

        <span className="text-xs text-gray-400 font-mono tracking-wider">
          {progresso}% concluído
        </span>
      </div>
    </div>
  );
};


