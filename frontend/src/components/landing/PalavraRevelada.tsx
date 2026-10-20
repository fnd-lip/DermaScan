import { motion, useTransform, type MotionValue } from "motion/react";
import { useMovimentoLanding } from "./useMovimentoLanding";

interface PalavraReveladaProps {
  readonly palavra: string;
  readonly indice: number;
  readonly total: number;
  readonly progresso: MotionValue<number>;
}

export function PalavraRevelada({
  palavra,
  indice,
  total,
  progresso,
}: PalavraReveladaProps) {
  const { pausado } = useMovimentoLanding();

  const inicio = (indice / total) * 0.85;
  const fim = Math.min(1, inicio + 0.13);

  const cor = useTransform(progresso, [inicio, fim], ["#c6c3d1", "#252137"]);

  return (
    <>
      <motion.span style={{ color: pausado ? "#252137" : cor }}>
        {palavra}
      </motion.span>{" "}
    </>
  );
}
