import React, { useEffect, useRef, useState } from "react";
import { LogOut, Settings, Shield, User } from "lucide-react";
import { UsuarioLogado } from "../../app/types/fluxo";
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
    <header className="bg-white px-8 py-4.5 border-b border-slate-200/80 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200">
          <Shield className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            DermaScan
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Classificação de Lesões Dermatológicas via Deep Learning
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">
            Painel Clínico
          </span>
          <p className="text-xs font-bold text-slate-850">{nomeUsuario}</p>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            className="w-10 h-10 bg-teal-50 rounded-xl border border-teal-250 flex items-center justify-center text-teal-700 font-bold font-mono text-xs hover:bg-teal-100 transition-colors"
            aria-label="Abrir menu do usuário"
            aria-expanded={menuAberto}
          >
            {obterIniciaisUsuario(nomeUsuario)}
          </button>

          {menuAberto && (
            <div className="absolute right-0 top-12 w-72 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/70 p-3 z-50">
              <div className="px-3 py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white text-xs font-black font-mono">
                    {obterIniciaisUsuario(nomeUsuario)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-slate-850 truncate">
                      {nomeUsuario}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {emailUsuario}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-2 space-y-1">
                <button
                  type="button"
                  onClick={handleAbrirPerfil}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Meu perfil
                </button>

                <button
                  type="button"
                  onClick={handleAbrirConfiguracoes}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSairDaConta}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
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
