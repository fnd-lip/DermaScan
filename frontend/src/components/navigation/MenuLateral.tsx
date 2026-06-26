import React from "react";
import {
  BookOpen,
  Camera,
  History,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { AbaAtiva, UsuarioLogado } from "../../app/types/fluxo";
import { obterIniciaisUsuario } from "../../utils/usuario";

interface MenuLateralProps {
  abaAtiva: AbaAtiva;
  usuarioLogado: UsuarioLogado | null;
  onAlterarAba: (aba: AbaAtiva) => void;
  onPrepararAnalise: () => void;
}

type AbaMenu = "inicio" | "analise" | "historico" | "educacao";

type ItemMenu = {
  id: AbaMenu;
  label: string;
  descricao: string;
  Icone: LucideIcon;
};

const itensMenu: ItemMenu[] = [
  {
    id: "inicio",
    label: "Início",
    descricao: "Resumo da conta",
    Icone: Smartphone,
  },
  {
    id: "analise",
    label: "Nova análise",
    descricao: "Enviar imagem",
    Icone: Camera,
  },
  {
    id: "historico",
    label: "Histórico",
    descricao: "Laudos salvos",
    Icone: History,
  },
  {
    id: "educacao",
    label: "Guia ABCDE",
    descricao: "Conteúdo educativo",
    Icone: BookOpen,
  },
];

export const MenuLateral: React.FC<MenuLateralProps> = ({
  abaAtiva,
  usuarioLogado,
  onAlterarAba,
  onPrepararAnalise,
}) => {
  const nomeUsuario = usuarioLogado?.nome || "Usuário Demo";

  const handleCliqueAba = (aba: AbaMenu) => {
    onAlterarAba(aba as AbaAtiva);

    if (aba === "analise") {
      onPrepararAnalise();
    }
  };

  return (
    <aside className="w-full shrink-0 rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm lg:w-64">
      <div className="flex h-full flex-col">
        <div className="rounded-3xl border border-teal-100 bg-teal-50/70 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-sm font-black text-white shadow-lg shadow-teal-600/20">
              {obterIniciaisUsuario(nomeUsuario)}
            </div>

            <div className="min-w-0">
              <h4 className="truncate text-sm font-black text-slate-900">
                {nomeUsuario}
              </h4>

              <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-teal-700">
                Conta ativa
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-5 space-y-1.5">
          {itensMenu.map(({ id, label, descricao, Icone }) => {
            const ativo = String(abaAtiva) === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => handleCliqueAba(id)}
                className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition ${
                  ativo
                    ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                    ativo
                      ? "bg-white/15 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-teal-700"
                  }`}
                >
                  <Icone className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <span className="block truncate text-sm font-black">
                    {label}
                  </span>

                  <span
                    className={`block truncate text-[11px] font-semibold ${
                      ativo ? "text-teal-50/80" : "text-slate-400"
                    }`}
                  >
                    {descricao}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
