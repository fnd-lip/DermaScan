import React from 'react';
import { Shield } from 'lucide-react';
import { UsuarioLogado } from '../../app/types/fluxo';
import { obterIniciaisUsuario } from '../../utils/usuario';

interface CabecalhoDashboardProps {
  usuarioLogado: UsuarioLogado | null;
}

export const CabecalhoDashboard: React.FC<CabecalhoDashboardProps> = ({ usuarioLogado }) => {
  const nomeUsuario = usuarioLogado?.nome || 'Usuário Demo';

  return (
    <header className="bg-white px-8 py-4.5 border-b border-slate-200/80 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
          <Shield className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">DermaScan</h1>
          <p className="text-xs text-slate-500 font-medium">Classificação de Lesões Dermatológicas via Deep Learning</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Painel Clínico</span>
          <p className="text-xs font-bold text-slate-850">{nomeUsuario}</p>
        </div>
        <div className="w-10 h-10 bg-teal-50 rounded-xl border border-teal-250 flex items-center justify-center text-teal-700 font-bold font-mono text-xs">
          {obterIniciaisUsuario(nomeUsuario)}
        </div>
      </div>
    </header>
  );
};



