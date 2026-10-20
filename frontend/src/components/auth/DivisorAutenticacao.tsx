import React from "react";

interface DivisorAutenticacaoProps {
  readonly texto: string;
}

export const DivisorAutenticacao: React.FC<
  Readonly<DivisorAutenticacaoProps>
> = ({ texto }) => {
  return (
    <div className="my-8 flex items-center gap-4 text-sm text-slate-400">
      <div className="h-px flex-1 bg-slate-200" />
      <span>{texto}</span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
};
