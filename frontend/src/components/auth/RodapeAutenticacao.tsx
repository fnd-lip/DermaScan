import React from "react";

interface RodapeAutenticacaoProps {
  tipo: "login" | "cadastro";
  onAlterarTipo: (tipo: "login" | "cadastro") => void;
}

export const RodapeAutenticacao: React.FC<RodapeAutenticacaoProps> = ({
  tipo,
  onAlterarTipo,
}) => {
  return (
    <div className="mt-6 border-t border-slate-100 pt-5 text-center">
      {tipo === "login" ? (
        <p className="text-xs text-slate-500">
          Não possui credenciais?{" "}
          <button
            type="button"
            onClick={() => onAlterarTipo("cadastro")}
            className="text-teal-600 font-bold hover:underline"
          >
            Crie seu usuário aqui
          </button>
        </p>
      ) : (
        <p className="text-xs text-slate-500">
          Já possui uma credencial de acesso?{" "}
          <button
            type="button"
            onClick={() => onAlterarTipo("login")}
            className="text-teal-600 font-bold hover:underline"
          >
            Fazer login
          </button>
        </p>
      )}
    </div>
  );
};