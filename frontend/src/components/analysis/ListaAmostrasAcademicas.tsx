import React, { useState } from "react";
import { Eye, ImageOff } from "lucide-react";
import { AMOSTRAS_LESOES } from "../../data/amostrasLesoes";

interface ListaAmostrasAcademicasProps {
  onSelecionarAmostra: (uri: string, sampleId?: string) => void;
}

export const ListaAmostrasAcademicas: React.FC<ListaAmostrasAcademicasProps> = ({
  onSelecionarAmostra,
}) => {
  const [imagensComErro, setImagensComErro] = useState<Record<string, boolean>>({});

  const marcarErroImagem = (id: string) => {
    setImagensComErro((estadoAtual) => ({
      ...estadoAtual,
      [id]: true,
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-2 px-1 gap-3">
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Testes rápidos do classificador
          </h3>

          <p className="text-[10px] text-gray-400 mt-0.5">
            Use uma amostra demonstrativa para testar o fluxo de análise.
          </p>
        </div>

        <span className="text-[9px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100 font-bold uppercase tracking-wider whitespace-nowrap">
          Demonstração
        </span>
      </div>

      <div className="space-y-2">
        {AMOSTRAS_LESOES.map((amostra) => {
          const imagemComErro = imagensComErro[amostra.id];

          return (
            <div
              key={amostra.id}
              onClick={() => onSelecionarAmostra(amostra.url, amostra.id)}
              className="bg-white border border-gray-200 p-2.5 rounded-xl hover:border-teal-300 hover:bg-teal-50/10 cursor-pointer shadow-sm hover:shadow-md transition-all flex items-center gap-3 group"
            >
              <div className="w-11 h-11 bg-slate-100 rounded-lg overflow-hidden relative border border-gray-200 shrink-0">
                {!imagemComErro ? (
                  <img
                    src={amostra.url}
                    alt={amostra.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={() => marcarErroImagem(amostra.id)}
                  />
                ) : (
                  <div className="w-full h-full bg-teal-50 flex flex-col items-center justify-center text-teal-700 text-[9px] font-bold text-center px-1">
                    <ImageOff className="w-4 h-4 mb-0.5" />
                    Sem imagem
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-bold text-gray-800 truncate block">
                    {amostra.nome}
                  </span>

                  <span className="text-[9px] font-bold text-gray-500 whitespace-nowrap">
                    {amostra.riskHint}
                  </span>
                </div>

                <p className="text-[10px] text-gray-400 truncate leading-snug mt-0.5">
                  {amostra.descricao}
                </p>
              </div>

              <div className="w-6 h-6 bg-slate-50 rounded-md border border-gray-100 flex items-center justify-center text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};