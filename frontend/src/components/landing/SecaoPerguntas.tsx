import { Plus } from "lucide-react";
import { perguntasLanding } from "../../data/conteudoLanding";
import { RevelarLanding } from "./RevelarLanding";

export function SecaoPerguntas() {
  return (
    <section
      id="perguntas"
      className="mx-auto grid max-w-360 scroll-mt-20 gap-12 px-[7%] py-24 lg:grid-cols-2 lg:gap-[10%]"
    >
      <RevelarLanding>
        <span className="text-[10px] font-semibold tracking-widest">
          03 / SEM COMPLICAÇÃO
        </span>

        <h2 className="mt-7 text-[clamp(2.8rem,4vw,3.4rem)] font-medium leading-tight tracking-[-0.06em]">
          <span className="block">O essencial,</span>
          <span className="block">com clareza.</span>
        </h2>

        <p className="mt-6 text-sm leading-7 text-[#686577]">
          Respostas diretas para conhecer o DermaScan.
        </p>
      </RevelarLanding>

      <RevelarLanding>
        {perguntasLanding.map((item) => (
          <details
            key={item.pergunta}
            name="perguntas-dermascan"
            className="group border-b border-[#e3e1eb] first:border-t"
          >
            <summary className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-5 py-5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-[#6962dd] [&::-webkit-details-marker]:hidden">
              <span>{item.pergunta}</span>

              <Plus
                size={21}
                aria-hidden="true"
                className="shrink-0 text-[#6962dd] transition-transform duration-300 group-open:rotate-45"
              />
            </summary>

            <p className="max-w-110 pb-6 pr-8 text-sm leading-7 text-[#686577]">
              {item.resposta}
            </p>
          </details>
        ))}
      </RevelarLanding>
    </section>
  );
}
