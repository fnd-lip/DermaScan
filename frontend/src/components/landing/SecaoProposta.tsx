import { useRef } from "react";
import { useScroll } from "motion/react";
import { PalavraRevelada } from "./PalavraRevelada";
import { RevelarLanding } from "./RevelarLanding";

const linhas = [
  ["Uma", "foto", "mostra", "a", "pele."],
  ["O", "contexto", "conta"],
  ["o", "resto", "da", "história."],
] as const;

const totalPalavras = linhas.flat().length;
const deslocamentos = [0, 5, 8] as const;

export function SecaoProposta() {
  const referencia = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: referencia,
    offset: ["start 80%", "end 52%"],
  });

  return (
    <section
      id="proposta"
      ref={referencia}
      className="mx-auto max-w-360 scroll-mt-20 px-[7%] py-24 sm:py-28"
    >
      <div className="mb-14 flex justify-between gap-4 border-b border-[#e3e1eb] pb-5 text-[10px] tracking-widest">
        <span>01 / A PROPOSTA</span>
        <span>DERMASCAN</span>
      </div>

      <h2 className="max-w-280 text-[clamp(2.6rem,6.2vw,5.375rem)] font-medium leading-[1.1] tracking-[-0.065em]">
        {linhas.map((linha, numeroLinha) => (
          <span key={numeroLinha} className="block">
            {linha.map((palavra, indicePalavra) => (
              <PalavraRevelada
                key={`${numeroLinha}-${palavra}`}
                palavra={palavra}
                indice={deslocamentos[numeroLinha] + indicePalavra}
                total={totalPalavras}
                progresso={scrollYProgress}
              />
            ))}
          </span>
        ))}
      </h2>

      <RevelarLanding className="mt-11 flex items-start justify-between gap-8">
        <span
          aria-hidden="true"
          className="text-7xl leading-none text-[#6962dd]"
        >
          ✳
        </span>

        <p className="max-w-110 text-sm leading-7 text-[#686577] sm:text-base">
          A proposta do DermaScan é reunir a observação da imagem e as
          informações clínicas. Mais contexto para quem está diante de uma
          decisão.
        </p>
      </RevelarLanding>
    </section>
  );
}
