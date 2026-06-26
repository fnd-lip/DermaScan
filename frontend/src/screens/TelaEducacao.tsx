import { useState } from "react";
import { CabecalhoEducacao } from "../components/education/CabecalhoEducacao";
import { CartaoArtigoEducativo } from "../components/education/CartaoArtigoEducativo";
import { artigosEducativos } from "../components/education/artigosEducativos";

export const TelaEducacao = () => {
  const [artigoAberto, setArtigoAberto] = useState<string | null>("abcde");

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50 p-5 pb-20 font-sans text-slate-800 select-none">
      <CabecalhoEducacao />

      <div className="mt-4 space-y-3.5">
        {artigosEducativos.map((artigo) => {
          const aberto = artigoAberto === artigo.id;

          return (
            <CartaoArtigoEducativo
              key={artigo.id}
              artigo={artigo}
              aberto={aberto}
              onAlternar={() => setArtigoAberto(aberto ? null : artigo.id)}
            />
          );
        })}
      </div>
    </div>
  );
};