import React from "react";
import { CabecalhoDashboard } from "../navigation/CabecalhoDashboard";
import type { UsuarioLogado } from "../../app/types/fluxo";

interface AppShellProps {
  children: React.ReactNode;
  mostrarCabecalho: boolean;
  usuarioLogado: UsuarioLogado | null;
  onAbrirPerfil: () => void;
  onAbrirConfiguracoes?: () => void;
  onSairDaConta: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  mostrarCabecalho,
  usuarioLogado,
  onAbrirPerfil,
  onAbrirConfiguracoes,
  onSairDaConta,
}) => {
  if (!mostrarCabecalho) {
    return (
      <div className="min-h-screen w-full bg-slate-950 font-sans text-slate-900">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-100 font-sans text-slate-900">
      <CabecalhoDashboard
        usuarioLogado={usuarioLogado}
        onAbrirPerfil={onAbrirPerfil}
        onAbrirConfiguracoes={onAbrirConfiguracoes}
        onSairDaConta={onSairDaConta}
      />

      <main className="min-h-0 flex-1 overflow-hidden">
        <section className="h-full overflow-hidden px-4 py-4 lg:px-5 lg:py-5">
          {children}
        </section>
      </main>
    </div>
  );
};

