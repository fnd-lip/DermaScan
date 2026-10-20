import { useRef } from "react";
import { motion } from "motion/react";
import { ArteHeroLanding } from "./ArteHeroLanding";
import { useMovimentoLanding } from "./useMovimentoLanding";

const suavizacao = [0.22, 1, 0.36, 1] as const;

export function HeroLanding() {
  const referencia = useRef<HTMLElement>(null);
  const { pausado } = useMovimentoLanding();

  const entrada = (atraso: number) => ({
    initial: pausado ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: pausado ? 0 : 0.9,
      delay: pausado ? 0 : atraso,
      ease: suavizacao,
    },
  });

  return (
    <section
      id="inicio"
      ref={referencia}
      className="relative mx-auto flex w-full min-w-0 max-w-360 flex-col gap-8.75 px-[7%] pt-7 pb-18.75 min-[701px]:grid min-[701px]:min-h-172.5 min-[701px]:grid-cols-[minmax(0,1.03fr)_minmax(0,1fr)] min-[701px]:items-center min-[701px]:gap-[4%] min-[701px]:px-[5.5%] min-[701px]:pt-10.5 min-[701px]:pb-22.5 min-[1001px]:min-h-185 min-[1001px]:gap-[6%] min-[1600px]:min-h-200"
    >
      <div className="relative z-10 min-w-0">
        <motion.div
          {...entrada(0)}
          className="flex items-center gap-2.5 text-[8px] font-semibold tracking-[0.16em] min-[701px]:text-[10px]"
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6962dd]"
          />
          <span>UM NOVO OLHAR PARA A PELE</span>
        </motion.div>

        <motion.h1
          {...entrada(0.12)}
          className="my-6.25 text-[clamp(53px,12vw,76px)] font-[550] leading-[1.02] tracking-[-0.074em] min-[701px]:text-[64px] min-[1001px]:text-[clamp(58px,6.25vw,92px)] min-[1001px]:leading-[0.98]"
        >
          Cada detalhe
          <br />
          conta.
          <br />
          <span className="text-[#6962dd]">
            Cada pessoa,
            <br />
            também.
          </span>
        </motion.h1>

        <motion.p
          {...entrada(0.24)}
          className="max-w-85 text-sm leading-[1.7] text-[#686577] min-[701px]:max-w-93.75 min-[701px]:text-base"
        >
          Imagem e contexto clínico, juntos para apoiar a avaliação inicial de
          lesões de pele.
        </motion.p>

        <motion.div {...entrada(0.32)}>
          <a
            href="#proposta"
            className="mt-7.5 inline-flex min-h-13 items-center justify-between gap-8 rounded-[10px] bg-[#6962dd] px-5.75 py-3.75 text-[13px] font-[550] text-white transition-[background-color,transform,box-shadow] duration-250 hover:-translate-y-0.75 hover:bg-[#554ec6] hover:shadow-[0_8px_24px_#6962dd24] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6962dd]"
          >
            <span>Conheça a proposta</span>
            <span aria-hidden="true">↓</span>
          </a>
        </motion.div>

        <motion.p
          {...entrada(0.4)}
          className="mt-3.25 text-[11px] text-[#686577]"
        >
          Pensado para profissionais de saúde.
        </motion.p>
      </div>

      <ArteHeroLanding referencia={referencia} />

      <div className="absolute right-[7%] bottom-3.75 left-[7%] flex items-center justify-between border-t border-[#e3e1eb] pt-4.5 text-[9px] tracking-[0.15em] text-[#686577] min-[701px]:right-[5.5%] min-[701px]:bottom-7 min-[701px]:left-[5.5%]">
        <span>CONTINUE EXPLORANDO</span>

        <motion.span
          aria-hidden="true"
          animate={{ y: pausado ? 0 : [0, 5, 0] }}
          transition={{
            duration: 2,
            repeat: pausado ? 0 : Infinity,
            ease: "easeInOut",
          }}
          className="text-lg"
        >
          ↓
        </motion.span>
      </div>
    </section>
  );
}
