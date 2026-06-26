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
    <div className="flex h-full flex-col overflow-y-auto bg-transparent px-5 py-5 text-slate-900 lg:px-6 lg:py-6">
      <div className="flex w-full flex-col gap-5 pb-10">
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
    </div>
  );
};
