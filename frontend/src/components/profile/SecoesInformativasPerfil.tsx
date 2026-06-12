import React, { useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, Camera, Info, ShieldCheck } from "lucide-react";
import {
  SecaoPerfilId,
  TipoIconeSecaoPerfil,
  secoesPerfil,
} from "../../data/secoesPerfil";

function obterIconeSecao(tipoIcone: TipoIconeSecaoPerfil): ReactNode {
  const icones: Record<TipoIconeSecaoPerfil, ReactNode> = {
    info: <Info className="w-5 h-5 text-teal-600" />,
    alerta: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    privacidade: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
    camera: <Camera className="w-5 h-5 text-emerald-600" />,
  };

  return icones[tipoIcone];
}

export const SecoesInformativasPerfil: React.FC = () => {
  const [abaAberta, setAbaAberta] = useState<SecaoPerfilId | null>("sobre");

  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2.5">
        Políticas e Atribuições
      </h3>

      <div className="space-y-3">
        {secoesPerfil.map((item) => {
          const aberto = abaAberta === item.id;
          const Conteudo = item.Conteudo;

          return (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setAbaAberta(aberto ? null : item.id)}
                className="w-full p-4 flex justify-between items-center text-left bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-gray-100 flex items-center justify-center shrink-0">
                    {obterIconeSecao(item.tipoIcone)}
                  </div>

                  <span className="text-xs.1 font-bold text-gray-700">
                    {item.titulo}
                  </span>
                </div>

                <span className="text-xs text-gray-400">
                  {aberto ? "Ocultar" : "Exibir"}
                </span>
              </button>

              {aberto && (
                <div className="px-4.5 pb-4.5 bg-white select-text font-normal animate-fadeIn">
                  <Conteudo />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
