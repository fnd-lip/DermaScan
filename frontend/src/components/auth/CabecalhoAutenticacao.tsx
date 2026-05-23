import React from "react";
import { Shield } from "lucide-react";

interface CabecalhoAutenticacaoProps {
  tipo: "login" | "cadastro";
  modoEsqueciSenha: boolean;
}

export const CabecalhoAutenticacao: React.FC<CabecalhoAutenticacaoProps> = ({
  tipo,
  modoEsqueciSenha,
}) => {
  const descricao = modoEsqueciSenha
    ? "Recupere sua senha clínica do DermaScan"
    : tipo === "login"
      ? "Faça login com suas credenciais clínicas autorizadas"
      : "Crie sua assinatura para iniciar o diagnóstico assistido";

  return (
    <div className="flex flex-col items-center text-center mb-6">
      <div className="w-14 h-14 bg-linear-to-tr from-teal-500 to-emerald-400 rounded-2xl flex items-center justify-center mb-3 shadow-md shadow-teal-100">
        <Shield className="w-7 h-7 text-white" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
        DermaScan
      </h2>
      <p className="text-xs text-slate-500 font-medium mt-1.5 max-w-70">
        {descricao}
      </p>
    </div>
  );
};
