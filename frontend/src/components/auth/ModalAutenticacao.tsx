import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface ModalAutenticacaoProps {
  readonly aberto: boolean;
  readonly children: ReactNode;
  readonly onFechar: () => void;
}

export function ModalAutenticacao({
  aberto,
  children,
  onFechar,
}: ModalAutenticacaoProps) {
  useEffect(() => {
    if (!aberto) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function fecharComEscape(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        onFechar();
      }
    }

    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [aberto, onFechar]);

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 px-4 py-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Fechar autenticação"
            className="absolute inset-0"
            onClick={onFechar}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Acesso ao DermaScan"
            className="relative z-10 my-auto w-full max-w-5xl"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
              {children}
            </div>

            <button
              type="button"
              onClick={onFechar}
              aria-label="Fechar modal"
              className="absolute top-3 right-3 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
