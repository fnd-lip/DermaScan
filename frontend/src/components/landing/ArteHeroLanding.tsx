import type { RefObject } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useMovimentoLanding } from "./useMovimentoLanding";

interface ArteHeroLandingProps {
  readonly referencia: RefObject<HTMLElement | null>;
}

export function ArteHeroLanding({ referencia }: ArteHeroLandingProps) {
  const { pausado } = useMovimentoLanding();

  const { scrollYProgress } = useScroll({
    target: referencia,
    offset: ["start start", "end start"],
  });

  const deslocamento = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 35]),
    { stiffness: 100, damping: 28 },
  );

  return (
    <motion.div
      className="relative isolate mx-auto h-110 w-[90%] max-w-95 min-w-0 lg:h-140 lg:w-full lg:max-w-none"
      initial={pausado ? false : { opacity: 0, y: 35, rotate: 3 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{
        duration: pausado ? 0 : 1.25,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={pausado ? undefined : { y: deslocamento }}
      >
        <div
          aria-hidden="true"
          className="absolute -top-1.25 -right-3 bottom-7.5 left-3.75 -z-10 rotate-7 rounded-t-[180px] rounded-b-[30px] border border-[#d6d2ee] lg:-top-2.5 lg:-right-5 lg:bottom-10 lg:left-5"
        />

        <div className="absolute inset-x-0 top-2.5 bottom-3.75 -rotate-3 overflow-hidden rounded-t-[140px] rounded-b-[22px] bg-[#eeecfa] lg:top-4.5 lg:right-5 lg:bottom-5.5 lg:rounded-t-[160px] lg:rounded-b-[28px]">
          <motion.img
            src="/assets/landing/medica.jpg"
            alt="Profissional de saúde com um olhar atento"
            width={914}
            height={974}
            fetchPriority="high"
            className="h-full w-full object-cover object-[50%_30%]"
            initial={pausado ? false : { scale: 1.16 }}
            animate={{ scale: 1.05 }}
            transition={{
              duration: pausado ? 0 : 1.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>

        <motion.div
          className="absolute bottom-9 -left-5 z-10 flex items-center gap-4 rounded-[14px] bg-white px-4 py-3 text-[13px] shadow-[0_15px_60px_#25213712] lg:bottom-12.5 lg:-left-8 lg:px-6.75 lg:py-5"
          animate={{ y: pausado ? 0 : [0, -10, 0] }}
          transition={{
            duration: 7,
            ease: "easeInOut",
            repeat: pausado ? 0 : Infinity,
          }}
        >
          <span aria-hidden="true" className="text-4xl text-[#6962dd]">
            {"\u2733"}
          </span>

          <span>
            <span className="block">O olhar humano.</span>
            <strong className="block font-[550]">Sempre no centro.</strong>
          </span>
        </motion.div>

        <motion.svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute -top-1.25 -right-3.75 h-16.25 w-16.25 stroke-[#6962dd] stroke-12 lg:top-1.25 lg:-right-5.5 lg:h-23.75 lg:w-23.75"
          animate={{ rotate: pausado ? 0 : 360 }}
          transition={{
            duration: 36,
            ease: "linear",
            repeat: pausado ? 0 : Infinity,
          }}
        >
          <path d="M50 0v100M0 50h100M15 15l70 70M15 85l70-70" />
        </motion.svg>

        <span className="absolute -bottom-2.5 right-7.5 text-[8px] tracking-[0.15em] text-[#686577] lg:-bottom-4">
          01 — UM OLHAR MAIS COMPLETO
        </span>
      </motion.div>
    </motion.div>
  );
}
