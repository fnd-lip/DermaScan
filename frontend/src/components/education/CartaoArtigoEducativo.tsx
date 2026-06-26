import { ChevronDown, ChevronUp } from "lucide-react";
import type { ArtigoEducativo } from "./types";

interface CartaoArtigoEducativoProps {
  artigo: ArtigoEducativo;
  aberto: boolean;
  onAlternar: () => void;
}

export const CartaoArtigoEducativo = ({
  artigo,
  aberto,
  onAlternar,
}: CartaoArtigoEducativoProps) => {
  const Icone = artigo.Icone;
  const Conteudo = artigo.Conteudo;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200">
      <button
        type="button"
        onClick={onAlternar}
        aria-expanded={aberto}
        className="flex w-full items-start gap-3.5 bg-white p-4 text-left transition-colors hover:bg-slate-50"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
          <Icone
            className={`h-5 w-5 ${artigo.classeIcone}`}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1 pr-2">
          <h3 className="text-sm font-bold leading-tight text-slate-900">
            {artigo.titulo}
          </h3>

          {!aberto && (
            <p className="mt-1 truncate text-xs leading-normal text-slate-500">
              {artigo.sumario}
            </p>
          )}
        </div>

        <div className="mt-2 shrink-0 text-slate-400">
          {aberto ? (
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          )}
        </div>
      </button>

      {aberto && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-3 text-xs leading-relaxed text-slate-700 select-text">
          <Conteudo />
        </div>
      )}
    </article>
  );
};