import React, { useState } from 'react';
import { Predicao } from '../types/Predicao';
import { ItemHistorico } from '../components/dermatology/ItemHistorico';
import { History, Shield, Trash2, Calendar, FileText, Filter } from 'lucide-react';

interface TelaHistoricoProps {
  historico: Predicao[];
  onSelecionarItem: (item: Predicao) => void;
  onExcluirItem: (id: string) => void;
  onLimparHistorico: () => void;
}

type TipoFiltro = 'todos' | 'baixo' | 'atenção' | 'alto';

export const TelaHistorico: React.FC<TelaHistoricoProps> = ({
  historico,
  onSelecionarItem,
  onExcluirItem,
  onLimparHistorico
}) => {
  const [filtro, setFiltro] = useState<TipoFiltro>('todos');

  // Filter list by selected risk level
  const historicoFiltrado = historico.filter(item => {
    if (filtro === 'todos') return true;
    const itemAtencao = item.nivelAtencao ? item.nivelAtencao.toLowerCase() : 'baixo';
    if (filtro === 'baixo') return itemAtencao === 'baixo';
    if (filtro === 'atenção') return itemAtencao === 'atenção' || itemAtencao === 'atencao' || itemAtencao === 'médio' || itemAtencao === 'medio';
    if (filtro === 'alto') return itemAtencao === 'alto';
    return true;
  });

  const filtros: { label: string; valor: TipoFiltro; style: string }[] = [
    { label: "Todos", valor: "todos", style: "border-gray-200" },
    { label: "Baixo Risco", valor: "baixo", style: "text-emerald-700 bg-emerald-50 border-emerald-100" },
    { label: "Atenção", valor: "atenção", style: "text-amber-700 bg-amber-50 border-amber-100" },
    { label: "Alto Risco", valor: "alto", style: "text-red-700 bg-red-50 border-red-100" }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 text-gray-800 p-5 overflow-y-auto font-sans pb-20 select-none">
      
      {/* Header and description */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xs text-teal-600 font-bold uppercase tracking-wider">Histórico</h4>
          <h2 className="text-xl font-bold text-gray-900 mt-1">Registros</h2>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Consulte análises armazenadas localmente no seu dispositivo.
          </p>
        </div>

        {historico.length > 0 && (
          <button
            onClick={onLimparHistorico}
            className="flex items-center gap-1 p-1.5 px-3 border border-red-150 rounded-xl text-red-600 hover:text-white hover:bg-red-600 active:bg-red-700 text-xs font-bold transition-all shrink-0"
            title="Limpar todos os registros"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar tudo
          </button>
        )}
      </div>

      {/* Filter Badges slider */}
      {historico.length > 0 && (
        <div className="my-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 pl-1">
            <Filter className="w-3 h-3 text-gray-400" />
            <span>Filtrar por risco</span>
          </div>
          
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {filtros.map((item) => (
              <button
                key={item.valor}
                onClick={() => setFiltro(item.valor)}
                className={`py-1.5 px-3 rounded-full text-[11px] font-bold border transition-all whitespace-nowrap outline-none ${
                  filtro === item.valor
                    ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List content */}
      <div className="space-y-3.5 flex-1 flex flex-col mt-2">
        {historico.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-3 py-16">
            <div className="w-16 h-16 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center text-teal-600">
              <History className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 leading-snug">Nenhuma análise realizada ainda</p>
              <p className="text-xs text-gray-400 mt-1 px-6 max-w-xs leading-relaxed">
                Faça sua primeira análise dermatológica tirando uma foto ou enviando um arquivo da galeria.
              </p>
            </div>
          </div>
        ) : historicoFiltrado.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-2.5 py-12">
            <Shield className="w-7 h-7 text-gray-300" />
            <p className="text-xs font-semibold text-gray-500">Nenhum registro correspondente ao filtro</p>
            <button
              onClick={() => setFiltro('todos')}
              className="text-xs font-bold text-teal-600 hover:underline mt-1"
            >
              Exibir todos os registros
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {historicoFiltrado.map((item) => (
              <ItemHistorico
                key={item.id}
                item={item}
                onSelect={onSelecionarItem}
                onDelete={(e, id) => onExcluirItem(id)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};



