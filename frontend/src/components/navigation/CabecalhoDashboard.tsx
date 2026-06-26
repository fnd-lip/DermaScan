import React, { useEffect, useRef, useState } from "react";
import { LogOut, Settings, Shield, User } from "lucide-react";
import type { UsuarioLogado } from "../../app/types/fluxo";
import { obterIniciaisUsuario } from "../../utils/usuario";

interface CabecalhoDashboardProps {
  usuarioLogado: UsuarioLogado | null;
  onAbrirPerfil?: () => void;
  onAbrirConfiguracoes?: () => void;
  onSairDaConta?: () => void;
}

export const CabecalhoDashboard: React.FC<CabecalhoDashboardProps> = ({
  usuarioLogado,
  onAbrirPerfil,
  onAbrirConfiguracoes,
  onSairDaConta,
}) => {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const nomeUsuario = usuarioLogado?.nome || "Usuário Demo";
  const emailUsuario = usuarioLogado?.email || "E-mail não informado";

  useEffect(() => {
    const handleCliqueFora = (evento: MouseEvent) => {
      if (!menuRef.current?.contains(evento.target as Node)) {
        setMenuAberto(false);
      }
    };

    const handleTeclaPressionada = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setMenuAberto(false);
      }
    };

    document.addEventListener("mousedown", handleCliqueFora);
    document.addEventListener("keydown", handleTeclaPressionada);

    return () => {
      document.removeEventListener("mousedown", handleCliqueFora);
      document.removeEventListener("keydown", handleTeclaPressionada);
    };
  }, []);

  const handleAbrirPerfil = () => {
    setMenuAberto(false);
    onAbrirPerfil?.();
  };

  const handleAbrirConfiguracoes = () => {
    setMenuAberto(false);
    onAbrirConfiguracoes?.();
  };

  const handleSairDaConta = () => {
    setMenuAberto(false);
    onSairDaConta?.();
  };

  return (
    <header className="flex h-19 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
          <Shield className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-950">
            DermaScan
          </h1>

          <p className="text-xs font-medium text-slate-500">
            Classificação assistida de lesões dermatológicas
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
            Área do usuário
          </span>

          <p className="text-sm font-black text-slate-900">{nomeUsuario}</p>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-teal-200 bg-teal-50 text-xs font-black text-teal-800 transition hover:bg-teal-100"
            aria-label="Abrir menu do usuário"
            aria-expanded={menuAberto}
          >
            {obterIniciaisUsuario(nomeUsuario)}
          </button>

          {menuAberto && (
            <div className="absolute right-0 top-14 z-50 w-72 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-300/50">
              <div className="border-b border-slate-100 px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-xs font-black text-white">
                    {obterIniciaisUsuario(nomeUsuario)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-900">
                      {nomeUsuario}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {emailUsuario}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1 py-2">
                <button
                  type="button"
                  onClick={handleAbrirPerfil}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  <User className="h-4 w-4" />
                  Meu perfil
                </button>

                {onAbrirConfiguracoes && (
                  <button
                    type="button"
                    onClick={handleAbrirConfiguracoes}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    <Settings className="h-4 w-4" />
                    Configurações
                  </button>
                )}
              </div>

              <div className="border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={handleSairDaConta}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sair da conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

