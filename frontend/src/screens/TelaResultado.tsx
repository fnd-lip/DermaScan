import React from "react";
import type { Predicao } from "../types/Predicao";
import { CartaoResultado } from "../components/dermatology/CartaoResultado";
import { CartaoAvisoMedico } from "../components/dermatology/CartaoAvisoMedico";
import { CabecalhoResultado } from "../components/result/CabecalhoResultado";
import { ResumoImagemResultado } from "../components/result/ResumoImagemResultado";
import { DetalhesResultado } from "../components/result/DetalhesResultado";
import { ListaProbabilidadesResultado } from "../components/result/ListaProbabilidadesResultado";
import { AcoesResultado } from "../components/result/AcoesResultado";
import {
  DESCRICAO_PADRAO_RESULTADO,
  DESCRICOES_CLASSES,
} from "../components/result/descricoesClasses";

interface TelaResultadoProps {
  predicao: Predicao;
  imagemUri: string;
  onNovaAnalise: () => void;
  onSalvarNoHistorico: () => void;
  salvo: boolean;
}

export const TelaResultado: React.FC<TelaResultadoProps> = ({
  predicao,
  imagemUri,
  onNovaAnalise,
  onSalvarNoHistorico,
  salvo,
}) => {
  const detalhesClasse =
    DESCRICOES_CLASSES[predicao.classePrevista] || DESCRICAO_PADRAO_RESULTADO;

  return (
    <div className="flex h-full flex-col space-y-4 overflow-y-auto bg-slate-50 p-5 pb-20 font-sans text-slate-800 select-none">
      <CabecalhoResultado />

      <CartaoResultado predicao={predicao} />

      <ResumoImagemResultado predicao={predicao} imagemUri={imagemUri} />

      <DetalhesResultado detalhesClasse={detalhesClasse} />

      <ListaProbabilidadesResultado predicao={predicao} />

      <CartaoAvisoMedico />

      <AcoesResultado
        salvo={salvo}
        onNovaAnalise={onNovaAnalise}
        onSalvarNoHistorico={onSalvarNoHistorico}
      />
    </div>
  );
};