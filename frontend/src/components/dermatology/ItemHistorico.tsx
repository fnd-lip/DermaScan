import React, { useState } from "react";
import { Calendar, ChevronRight, ImageOff, Trash2 } from "lucide-react";
import { Predicao } from "../../types/Predicao";
import { formatarPorcentagem } from "../../utils/formatarPorcentagem";
import { obterEstiloRisco } from "../../utils/nivelDeRisco";
import { formatarData } from "@/src/utils/formatarData";

interface ItemHistoricoProps {
  item: Predicao;
  onSelect: (item: Predicao) => void;
  onDelete?: (event: React.MouseEvent, id: string) => void;
}

export const ItemHistorico: React.FC<ItemHistoricoProps> = ({
  item,
  onSelect,
  onDelete,
}) => {
  const estilo = obterEstiloRisco(item.nivelAtencao);
  const [imagemComErro, setImagemComErro] = useState<string | null>(null);

  const itemId = item.id;

  const temImagemValida =
    Boolean(item.imagemUri) && imagemComErro !== item.imagemUri;

  return (
    <div className="bg-white border border-gray-100 p-3.5 rounded-xl hover:border-teal-200 shadow-sm hover:shadow-md transition-all duration-200 flex gap-3 items-center group relative overflow-hidden">
      <button
        type="button"
        onClick={() => onSelect(item)}
        aria-label={`Ver detalhes da análise ${item.classePrevista}`}
        className="absolute inset-0 z-10 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500"
      >
        <span className="sr-only">
          Ver detalhes da análise {item.classePrevista}
        </span>
      </button>

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
        {onDelete && itemId && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(event, itemId);
            }}
            className="relative z-20 p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            title="Excluir análise"
            aria-label={`Excluir análise ${item.classePrevista}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <div
          aria-hidden="true"
          className="text-gray-300 group-hover:text-teal-600 transition-colors"
        >
          <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};
