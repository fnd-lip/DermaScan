import { ArrowUpRight } from "lucide-react";

export function RodapeLanding() {
  return (
    <footer className="border-t border-[#e3e1eb] bg-[#fafafc]">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-5 px-[5.5%] py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium tracking-tight text-[#252137]">
            DermaScan
          </span>

          <span className="text-xs text-[#686577]">
            © {new Date().getFullYear()} DermaScan. Todos os direitos
            reservados.
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden text-xs text-[#686577] md:inline">
            Cada detalhe conta.
          </span>

          <a
            href="#inicio"
            className="group inline-flex items-center gap-2 text-xs font-medium text-[#252137] transition-colors duration-300 hover:text-[#6962dd] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6962dd]"
          >
            <span>Voltar ao início</span>

            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
