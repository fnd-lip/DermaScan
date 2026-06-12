import React from 'react';
import { CabecalhoDashboard } from '../navigation/CabecalhoDashboard';
import { UsuarioLogado } from '../../app/types/fluxo';

interface AppShellProps {
  children: React.ReactNode;
  mostrarCabecalho: boolean;
  usuarioLogado: UsuarioLogado | null;
  onAbrirPerfil: () => void;
  onSairDaConta: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  mostrarCabecalho,
  usuarioLogado,
  onAbrirPerfil,
  onSairDaConta,
}) => {
  return (
    <div className="w-full h-full min-h-screen bg-slate-50 font-sans flex flex-col overflow-hidden text-slate-800 select-none">
      {mostrarCabecalho && (
        <CabecalhoDashboard
          usuarioLogado={usuarioLogado}
          onAbrirPerfil={onAbrirPerfil}
          onSairDaConta={onSairDaConta}
        />
      )}

      <main className="flex-1 flex flex-col overflow-hidden min-h-0">
        <section className="flex-1 bg-slate-100 flex flex-col p-6 h-full overflow-hidden relative">
          {children}
        </section>
      </main>
    </div>
  );
};


