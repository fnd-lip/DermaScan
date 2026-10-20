import { ArrowUp, ArrowUpRight } from "lucide-react";
import { RevelarLanding } from "./RevelarLanding";

interface SecaoEncerramentoProps {
  readonly onAbrirCadastro: () => void;
}

export function SecaoEncerramento({ onAbrirCadastro }: SecaoEncerramentoProps) {
  return (
    <section className="border-t border-[#e3e1eb] px-6 py-22 text-center">
      <RevelarLanding>
        <span className="text-[10px] font-semibold tracking-widest">
          DERMASCAN
        </span>

        <h2 className="mt-7 text-[clamp(2.8rem,6vw,5rem)] font-medium leading-tight tracking-[-0.06em]">
          <span className="block">Um olhar atento.</span>
          <span className="block text-[#6962dd]">Desde o início.</span>
        </h2>

        <button
          type="button"
          onClick={onAbrirCadastro}
          className="mt-8 inline-flex min-h-13 cursor-pointer items-center gap-3 rounded-xl bg-[#6962dd] px-7 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#554ec6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6962dd]"
        >
          <span>Criar conta</span>
          <ArrowUpRight size={17} aria-hidden="true" />
        </button>

        <a
          href="#inicio"
          aria-label="Voltar ao início"
          className="mx-auto mt-7 flex h-12 w-12 items-center justify-center rounded-full border border-[#e3e1eb] transition-colors hover:bg-[#eeecfa]"
        >
          <ArrowUp size={18} aria-hidden="true" />
        </a>
      </RevelarLanding>
    </section>
  );
}
