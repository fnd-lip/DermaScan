import React from "react";

interface CabecalhoInicioProps {
  nomeUsuario?: string;
}

export const CabecalhoInicio: React.FC<CabecalhoInicioProps> = ({
  nomeUsuario = "Usuário",
}) => {
  const primeiroNome = nomeUsuario.split(" ")[0];

  return (
    <header className="flex flex-col gap-1.5">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">
        Área do usuário
      </span>

      <h1 className="text-2xl font-black tracking-tight text-slate-950 lg:text-3xl">
        Olá, {primeiroNome}.
      </h1>

      <p className="text-sm leading-6 text-slate-600">
        Inicie uma análise visual de lesão dermatológica ou consulte seus
        resultados salvos.
      </p>
    </header>
  );
};
