import React from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";

interface ItemPreferenciaPerfilProps {
  titulo: string;
  descricao: string;
  ativo: boolean;
  onToggle: () => void;
  descricaoLeve?: boolean;
}

export const ItemPreferenciaPerfil: React.FC<ItemPreferenciaPerfilProps> = ({
  titulo,
  descricao,
  ativo,
  onToggle,
  descricaoLeve = false,
}) => {
  return (
    <div className="p-4 flex justify-between items-center bg-white">
      <div>
        <span className="text-xs font-bold text-gray-800 block">{titulo}</span>

        <p
          className={`text-[10px] text-gray-400 leading-snug mt-0.5 ${
            descricaoLeve ? "font-light" : ""
          }`}
        >
          {descricao}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="text-teal-600 focus:outline-none shrink-0 pl-1"
        aria-pressed={ativo}
        aria-label={`${ativo ? "Desativar" : "Ativar"} ${titulo}`}
      >
        {ativo ? (
          <ToggleRight className="w-9 h-9" aria-hidden="true" />
        ) : (
          <ToggleLeft className="w-9 h-9 text-gray-300" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};
