import React from "react";

interface CabecalhoPerfilProps {
  nomeUsuario: string;
  emailUsuario: string;
  historicoCount: number;
}

function obterIniciais(nome: string) {
  const iniciais = nome
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return iniciais || "US";
}

export const CabecalhoPerfil: React.FC<CabecalhoPerfilProps> = ({
  nomeUsuario,
  emailUsuario,
  historicoCount,
}) => {
  return (
    <div className="bg-white border border-gray-100 p-4.5 rounded-2xl flex items-center gap-4 shadow-sm">
      <div className="w-14 h-14 bg-teal-55 bg-teal-50 text-teal-700 font-bold border border-teal-100 rounded-full flex items-center justify-center text-lg shadow-inner">
        {obterIniciais(nomeUsuario)}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 leading-none">{nomeUsuario}</h3>

        <p className="text-[11px] text-gray-400 mt-1 font-mono truncate">
          {emailUsuario}
        </p>

        <div className="flex gap-2 mt-2">
          <span className="text-[9px] bg-teal-50 text-teal-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
            Usuário
          </span>

          <span className="text-[9px] bg-slate-100 text-gray-600 font-bold px-2 py-0.5 rounded-full font-mono">
            Laudos: {historicoCount}
          </span>
        </div>
      </div>
    </div>
  );
};
