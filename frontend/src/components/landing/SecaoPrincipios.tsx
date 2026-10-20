import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { principiosLanding } from "../../data/conteudoLanding";
import { CartaoPrincipio } from "./CartaoPrincipio";
import { RevelarLanding } from "./RevelarLanding";

export function SecaoPrincipios() {
  const [ativo, setAtivo] = useState(0);
  const botoes = useRef<(HTMLButtonElement | null)[]>([]);

  function navegar(evento: KeyboardEvent<HTMLButtonElement>, indice: number) {
    const total = principiosLanding.length;
    let proximo: number;

    switch (evento.key) {
      case "Home":
        proximo = 0;
        break;
      case "End":
        proximo = total - 1;
        break;
      case "ArrowRight":
      case "ArrowDown":
        proximo = (indice + 1) % total;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        proximo = (indice + total - 1) % total;
        break;
      default:
        return;
    }

    evento.preventDefault();
    setAtivo(proximo);
    botoes.current[proximo]?.focus();
  }

  return (
    <section
      id="principios"
      className="mx-auto max-w-360 scroll-mt-20 px-[7%] py-24"
    >
      <div className="mb-14 flex justify-between border-b border-[#e3e1eb] pb-5 text-[10px] tracking-widest">
        <span>02 / NOSSO OLHAR</span>
        <span>TRÊS IDEIAS. UM PROPÓSITO.</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-[8%]">
        <RevelarLanding>
          <h2 className="text-[clamp(2.8rem,4.5vw,4rem)] font-medium leading-tight tracking-[-0.06em]">
            <span className="block">O que importa</span>
            <span className="block">não cabe só</span>
            <span className="block text-[#6962dd]">na imagem.</span>
          </h2>

          <p className="mt-6 max-w-85 text-sm leading-7 text-[#686577]">
            Três princípios que orientam o DermaScan: observar, compreender e
            apoiar quem cuida.
          </p>

          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="Princípios do DermaScan"
            className="mt-10 max-w-95"
          >
            {principiosLanding.map((item, indice) => (
              <button
                key={item.numero}
                type="button"
                role="tab"
                id={`aba-principio-${indice}`}
                aria-controls="painel-principio"
                aria-selected={ativo === indice}
                tabIndex={ativo === indice ? 0 : -1}
                ref={(elemento) => {
                  botoes.current[indice] = elemento;
                }}
                onClick={() => setAtivo(indice)}
                onKeyDown={(evento) => navegar(evento, indice)}
                className={`flex min-h-15 w-full cursor-pointer items-center gap-6 border-t border-[#e3e1eb] px-2 text-left transition-all duration-300 last:border-b hover:pl-4 ${
                  ativo === indice ? "text-[#6962dd]" : "text-[#686577]"
                }`}
              >
                <span className="text-xs">{item.numero}</span>
                <span className="flex-1 text-sm">{item.nome}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
        </RevelarLanding>

        <RevelarLanding delay={0.1}>
          <CartaoPrincipio
            principio={principiosLanding[ativo]}
            indice={ativo}
          />
        </RevelarLanding>
      </div>
    </section>
  );
}
