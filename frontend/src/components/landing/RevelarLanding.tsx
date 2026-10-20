import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useMovimentoLanding } from "./useMovimentoLanding";

interface RevelarLandingProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}

export function RevelarLanding({
  children,
  className,
  delay = 0,
}: RevelarLandingProps) {
  const { pausado } = useMovimentoLanding();

  return (
    <motion.div
      className={className}
      initial={pausado ? false : { opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.13,
      }}
      transition={{
        duration: pausado ? 0 : 0.85,
        delay: pausado ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
