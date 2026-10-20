import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { RevelarLanding } from "./RevelarLanding";
import { useMovimentoLanding } from "./useMovimentoLanding";

export function SecaoEditorial() {
  const referencia = useRef<HTMLElement>(null);
  const { pausado } = useMovimentoLanding();

  const { scrollYProgress } = useScroll({
    target: referencia,
    offset: ["start end", "end start"],
  });

  const movimento = useSpring(
    useTransform(scrollYProgress, [0, 1], [-36, 36]),
    { stiffness: 95, damping: 30 },
  );

  return (
    <section
      ref={referencia}
      aria-label="O olhar profissional permanece no centro"
      className="relative flex min-h-150 items-end overflow-hidden bg-[#1c3439] text-white lg:items-center"
    >
      <div className="absolute -inset-y-12 inset-x-0">
        <motion.img
          src="/assets/landing/hero-v10.png"
          alt="Profissional de saúde em ambiente clínico"
          width={1672}
          height={941}
          loading="lazy"
          className="h-full w-full object-cover object-[70%_center]"
          style={pausado ? undefined : { y: movimento }}
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#102c32]/95 via-[#102c32]/65 to-transparent lg:bg-linear-to-r lg:from-[#102c32]/95 lg:via-[#102c32]/60 lg:to-transparent" />
      </div>

      <RevelarLanding className="relative z-10 mx-auto w-full max-w-360 px-[7%] py-20">
        <span className="text-[10px] font-semibold tracking-widest">
          A TECNOLOGIA APOIA. VOCÊ DECIDE.
        </span>

        <h2 className="mt-7 text-[clamp(3.5rem,7vw,6.25rem)] font-medium leading-none tracking-[-0.06em]">
          <span className="block">Mais espaço</span>
          <span className="block">para o seu</span>
          <span className="block text-[#b8b2f3]">olhar.</span>
        </h2>

        <p className="mt-7 max-w-85 text-sm leading-7 text-[#d1dedd]">
          O DermaScan é uma proposta de apoio à avaliação. O julgamento clínico
          e a decisão sobre o cuidado continuam com o profissional.
        </p>
      </RevelarLanding>
    </section>
  );
}
