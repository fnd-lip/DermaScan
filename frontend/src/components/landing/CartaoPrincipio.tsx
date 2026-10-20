import { AnimatePresence, motion } from "motion/react";
import type { PrincipioLanding } from "../../data/conteudoLanding";
import { useMovimentoLanding } from "./useMovimentoLanding";

interface CartaoPrincipioProps {
  readonly principio: PrincipioLanding;
  readonly indice: number;
}

const fundos = ["#eeecfa", "#edf1ed", "#f7ece8"] as const;
const tons = ["#766ad7", "#749a81", "#ba8276"] as const;

const estados = [
  { x1: -45, y1: 0, x2: 45, y2: 0, rotate: 0, raio: "50%" },
  { x1: -30, y1: -20, x2: 30, y2: 20, rotate: 45, raio: "22px" },
  {
    x1: -45,
    y1: 0,
    x2: 45,
    y2: 0,
    rotate: 0,
    raio: "50% 50% 15% 15%",
  },
] as const;

export function CartaoPrincipio({ principio, indice }: CartaoPrincipioProps) {
  const { pausado } = useMovimentoLanding();
  const cena = estados[indice] ?? estados[0];
  const tom = tons[indice] ?? tons[0];

  return (
    <motion.div
      className="relative flex min-h-125 flex-col justify-between overflow-hidden rounded-3xl p-7 sm:p-10"
      animate={{ backgroundColor: fundos[indice] ?? fundos[0] }}
      transition={{ duration: pausado ? 0 : 0.7 }}
    >
      <div
        aria-hidden="true"
        className="relative mx-auto flex h-60 w-full items-center justify-center"
      >
        <motion.div
          className="absolute h-40 w-40 mix-blend-multiply"
          style={{ backgroundColor: tom, opacity: 0.32 }}
          animate={{
            x: cena.x1,
            y: cena.y1,
            rotate: cena.rotate,
            borderRadius: cena.raio,
          }}
          transition={{
            duration: pausado ? 0 : 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        <motion.div
          className="absolute h-40 w-40 mix-blend-multiply"
          style={{ backgroundColor: tom, opacity: 0.18 }}
          animate={{
            x: cena.x2,
            y: cena.y2,
            rotate: cena.rotate,
            borderRadius: cena.raio,
          }}
          transition={{
            duration: pausado ? 0 : 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        <motion.div
          className="absolute h-16 w-16 rounded-full"
          style={{ backgroundColor: tom }}
          animate={{
            scale: pausado ? 1 : [1, 1.12, 1],
            opacity: pausado ? 0.9 : [0.75, 1, 0.75],
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            repeat: pausado ? 0 : Infinity,
          }}
        />

        <div className="absolute inset-3 rounded-full border border-[#8a7fca]/20" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={principio.numero}
          id="painel-principio"
          role="tabpanel"
          aria-labelledby={`aba-principio-${indice}`}
          tabIndex={0}
          initial={pausado ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: pausado ? 0 : -8 }}
          transition={{ duration: pausado ? 0 : 0.35 }}
        >
          <span
            className="text-[10px] font-semibold tracking-widest"
            style={{ color: tom }}
          >
            {principio.numero} / {principio.nome.toUpperCase()}
          </span>

          <h3 className="mt-4 max-w-95 text-3xl font-medium tracking-tight sm:text-4xl">
            {principio.titulo}
          </h3>

          <p className="mt-4 max-w-90 text-sm leading-7 text-[#686577]">
            {principio.descricao}
          </p>
        </motion.div>
      </AnimatePresence>

      <span className="mt-7 text-[9px] tracking-widest text-[#686577]">
        PRINCÍPIOS DO DERMASCAN
      </span>
    </motion.div>
  );
}
