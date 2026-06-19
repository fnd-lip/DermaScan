import React from "react";
import { Predicao } from "../types/Predicao";
import { CabecalhoInicio } from "../components/home/CabecalhoInicio";
import { CardNovaAnalise } from "../components/home/CardNovaAnalise";
import { CardUltimaAnalise } from "../components/home/CardUltimaAnalise";
import { AtalhosInicio } from "../components/home/AtalhosInicio";

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
  nomeUsuario = "Felipe",
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-gray-800 p-5 overflow-y-auto space-y-5 font-sans pb-20 select-none">
      <CabecalhoInicio nomeUsuario={nomeUsuario} />

      <CardNovaAnalise onIrParaAnalise={onIrParaAnalise} />

      <CardUltimaAnalise
        ultimaAnalise={ultimaAnalise}
        onVerDetalhesUltima={onVerDetalhesUltima}
        onIrParaAnalise={onIrParaAnalise}
      />

      <AtalhosInicio
        onIrParaHistorico={onIrParaHistorico}
        onIrParaEducacao={onIrParaEducacao}
      />
    </div>
  );
};
