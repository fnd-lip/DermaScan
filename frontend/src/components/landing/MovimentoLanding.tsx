import { useCallback, useMemo, useState, type ReactNode } from "react";

import { useReducedMotion } from "motion/react";

import {
  ContextoMovimentoLanding,
  type MovimentoContexto,
} from "./useMovimentoLanding";

interface ProvedorMovimentoProps {
  readonly children: ReactNode;
}

export function ProvedorMovimentoLanding({ children }: ProvedorMovimentoProps) {
  const [pausaManual, setPausaManual] = useState(false);
  const movimentoReduzido = useReducedMotion();

  const pausado = pausaManual || Boolean(movimentoReduzido);
  const podeAlternar = !movimentoReduzido;

  const alternar = useCallback(() => {
    setPausaManual((anterior) => !anterior);
  }, []);

  const valorContexto = useMemo<MovimentoContexto>(
    () => ({
      pausado,
      podeAlternar,
      alternar,
    }),
    [pausado, podeAlternar, alternar],
  );

  return (
    <ContextoMovimentoLanding.Provider value={valorContexto}>
      {children}
    </ContextoMovimentoLanding.Provider>
  );
}
