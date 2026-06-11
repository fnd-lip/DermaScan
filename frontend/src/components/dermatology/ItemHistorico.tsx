import React, { useState } from "react";
import { Calendar, ChevronRight, ImageOff, Trash2 } from "lucide-react";
import { Predicao } from "../../types/Predicao";
import { obterEstiloRisco } from "../../utils/nivelDeRisco";
import { formatarPorcentagem } from "../../utils/formatarPorcentagem";
import { formatarData } from "@/src/utils/formatarData";

interface ItemHistoricoProps {
  item: Predicao;
  onSelect: (item: Predicao) => void;
  onDelete?: (e: React.MouseEvent, id: string) => void;
}

export const ItemHistorico: React.FC<ItemHistoricoProps> = ({
  item,
  onSelect,
  onDelete,
}) => {
  const estilo = obterEstiloRisco(item.nivelAtencao);
  const [imagemComErro, setImagemComErro] = useState<string | null>(null);

  const temImagemValida =
    Boolean(item.imagemUri) && imagemComErro !== item.imagemUri;

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white border border-gray-100 p-3.5 rounded-xl hover:border-teal-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 flex gap-3 items-center group relative overflow-hidden"
    >
      <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden relative shrink-0 border border-gray-150">
        {temImagemValida ? (
          <img
            src={item.imagemUri}
            alt={`Imagem da análise ${item.classePrevista}`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImagemComErro(item.imagemUri ?? null)}
          />
        ) : (
          <div className="w-full h-full bg-teal-50 flex flex-col items-center justify-center text-teal-700 text-[10px] font-bold text-center px-1">
            <ImageOff className="w-4 h-4 mb-0.5" />
            Sem imagem
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-sm text-gray-900 truncate">
            {item.classePrevista}
          </h4>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${estilo.badge}`}
          >
            {item.nivelAtencao}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
          <span>
            Confiança:{" "}
            <strong className="font-mono text-teal-800 font-bold">
              {formatarPorcentagem(item.confianca)}
            </strong>
          </span>

          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-400" />
            {formatarData(item.dataAnalise)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {onDelete && item.id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e, item.id!);
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors pointer-events-auto"
            title="Excluir análise"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div className="text-gray-300 group-hover:text-teal-600 transition-colors">
          <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};