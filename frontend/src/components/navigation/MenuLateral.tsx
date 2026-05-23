import React from 'react';
import { BookOpen, Camera, History, Smartphone, User } from 'lucide-react';
import { AbaAtiva, UsuarioLogado } from '../../app/types/fluxo';
import { obterIniciaisUsuario } from '../../utils/usuario';

interface MenuLateralProps {
  abaAtiva: AbaAtiva;
  usuarioLogado: UsuarioLogado | null;
  onAlterarAba: (aba: AbaAtiva) => void;
  onPrepararAnalise: () => void;
}

const itensMenu: Array<{
  id: AbaAtiva;
  label: string;
  Icone: React.ElementType;
}> = [
  { id: 'inicio', label: 'Painel Clínico', Icone: Smartphone },
  { id: 'analise', label: 'Nova Análise Dermatológica', Icone: Camera },
  { id: 'historico', label: 'Histórico de Laudos', Icone: History },
  { id: 'educacao', label: 'Guia Educativo ABCDE', Icone: BookOpen },
  { id: 'perfil', label: 'Configurações', Icone: User },
];

export const MenuLateral: React.FC<MenuLateralProps> = ({
  abaAtiva,
  usuarioLogado,
  onAlterarAba,
  onPrepararAnalise,
}) => {
  const nomeUsuario = usuarioLogado?.nome || 'Usuário Demo';

  const handleCliqueAba = (aba: AbaAtiva) => {
    onAlterarAba(aba);
    if (aba === 'analise') onPrepararAnalise();
  };

  return (
    <nav className="w-full lg:w-60 bg-white border border-slate-200/80 rounded-3xl p-4.5 flex flex-col justify-between shrink-0 shadow-sm">
      <div className="space-y-6">
        <div className="p-3 bg-teal-50/50 rounded-2xl border border-teal-100/35 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-650 flex items-center justify-center text-white text-xs font-black font-mono">
            {obterIniciaisUsuario(nomeUsuario)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-850 truncate">{nomeUsuario}</h4>
            <p className="text-[10px] text-teal-650 font-bold tracking-wide font-mono uppercase truncate">Clínico Ativo</p>
          </div>
        </div>

        <div className="space-y-1.5">
          {itensMenu.map(({ id, label, Icone }) => {
            const ativo = abaAtiva === id;
            return (
              <button
                key={id}
                onClick={() => handleCliqueAba(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                  ativo
                    ? 'bg-teal-600 border-teal-700 text-white shadow-lg shadow-teal-500/15'
                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-850 hover:bg-slate-50'
                }`}
              >
                <Icone className={`w-4 h-4 transition-transform ${ativo ? 'scale-110' : ''}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider px-2">STATUS CLASSIFICADOR CNN</div>
        <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold py-2 px-3 rounded-2xl border border-emerald-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="truncate">DeepLearning Ativo</span>
        </div>
      </div>
    </nav>
  );
};



