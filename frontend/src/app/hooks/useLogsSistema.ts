import { useCallback, useState } from "react";
import { LogSistema, TipoLog } from "../types/fluxo";

export function useLogsSistema() {
  const [logs, setLogs] = useState<LogSistema[]>([
    {
      tempo: new Date().toLocaleTimeString(),
      mensagem: "Sistema inicializado.",
      tipo: "info",
    },
  ]);

  const adicionarLog = useCallback(
    (mensagem: string, tipo: TipoLog = "info") => {
      setLogs((anteriores) => [
        {
          tempo: new Date().toLocaleTimeString(),
          mensagem,
          tipo,
        },
        ...anteriores.slice(0, 15),
      ]);
    },
    [],
  );

  return {
    logs,
    adicionarLog,
  };
}