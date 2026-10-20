import { createContext, useContext } from "react";

export interface MovimentoContexto {
  readonly pausado: boolean;
  readonly podeAlternar: boolean;
  readonly alternar: () => void;
}

export const ContextoMovimentoLanding = createContext<MovimentoContexto | null>(
  null,
);

export function useMovimentoLanding(): MovimentoContexto {
  const contexto = useContext(ContextoMovimentoLanding);

  if (!contexto) {
    throw new Error("useMovimentoLanding deve ser usado dentro do provedor");
  }

  return contexto;
}
