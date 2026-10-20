import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

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
  const reduzirMovimento = useReducedMotion();

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
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#171426]/55 px-4 py-6 backdrop-blur-[6px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Fechar autenticação"
            className="absolute inset-0 cursor-default"
            onClick={onFechar}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Acesso ao DermaScan"
            className="relative z-10 my-auto w-full max-w-240"
            initial={{
              opacity: 0,
              y: reduzirMovimento ? 0 : 14,
              scale: reduzirMovimento ? 1 : 0.985,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: reduzirMovimento ? 0 : 10,
              scale: reduzirMovimento ? 1 : 0.99,
            }}
            transition={{
              duration: reduzirMovimento ? 0.1 : 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_-24px_rgba(20,17,43,0.35)]">
              {children}
            </div>

            <button
              type="button"
              onClick={onFechar}
              aria-label="Fechar modal"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#e9e6f1] bg-white text-[#56516b] shadow-sm transition-all duration-200 hover:bg-[#f7f5fc] hover:text-[#252137] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6962dd]"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
