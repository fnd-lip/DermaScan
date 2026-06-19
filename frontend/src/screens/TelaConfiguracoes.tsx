import React from "react";
import { PreferenciasPerfil } from "../components/profile/PreferenciasPerfil";

interface TelaConfiguracoesProps {
  salvarHistoricoAutomaticamente: boolean;
  onToggleSalvarAuto: (ativo: boolean) => void;
}

export const TelaConfiguracoes: React.FC<TelaConfiguracoesProps> = ({
  salvarHistoricoAutomaticamente,
  onToggleSalvarAuto,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-gray-800 p-5 overflow-y-auto font-sans pb-20 select-none">
      <div>
        <h4 className="text-xs text-teal-600 font-bold uppercase tracking-wider">
          Configurações
        </h4>

        <h2 className="text-xl font-bold text-gray-900 mt-1">
          Preferências do sistema
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          Ajuste preferências gerais da aplicação.
        </p>
      </div>

      <div className="mt-5">
        <PreferenciasPerfil
          salvarAuto={salvarHistoricoAutomaticamente}
          onToggleSalvarAuto={onToggleSalvarAuto}
        />
      </div>
    </div>
  );
};