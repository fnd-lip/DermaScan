import React from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface ModalAutenticacaoProps {
  aberto: boolean;
  children: React.ReactNode;
  onFechar: () => void;
}

export const ModalAutenticacao: React.FC<ModalAutenticacaoProps> = ({
  aberto,
  children,
  onFechar,
}) => {
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          key="modal-autenticacao"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Fechar autenticação"
            className="absolute inset-0 cursor-default"
            onClick={onFechar}
          />

          <motion.div
            className="relative z-10 w-full max-w-md"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22 }}
          >
            <button
              type="button"
              onClick={onFechar}
              className="absolute -top-3 -right-3 z-20 w-10 h-10 rounded-2xl bg-white text-slate-700 border border-slate-200 shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};