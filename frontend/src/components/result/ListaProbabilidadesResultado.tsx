import React from "react";
import type { Predicao } from "../../types/Predicao";
import { BarraProbabilidade } from "../ui/BarraProbabilidade";
import { normalizarClasseDermatologica } from "../../utils/normalizarClasseDermatologica";

interface ListaProbabilidadesResultadoProps {
  predicao: Predicao;
}

export const ListaProbabilidadesResultado: React.FC<
  ListaProbabilidadesResultadoProps
> = ({ predicao }) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="mb-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Distribuição completa de sinais
      </h4>

      <div className="space-y-4">
        {predicao.probabilidades.map((probabilidade, index) => (
          <BarraProbabilidade
            key={`${probabilidade.classe}-${index}`}
            classe={normalizarClasseDermatologica(probabilidade.classe)}
            probabilidade={probabilidade.probabilidade}
            destacar={probabilidade.classe === predicao.classePrevista}
          />
        ))}
      </div>
    </section>
  );
};
