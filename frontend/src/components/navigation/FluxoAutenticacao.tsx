import { AnimatePresence } from "motion/react";
import type { FaseFluxo } from "../../app/types/fluxo";
import { TelaLoginCadastro } from "../../screens/TelaLoginCadastro";
import { TelaLandingPage } from "../../screens/TelaLandingPage";
import { ModalAutenticacao } from "../auth/ModalAutenticacao";

interface FluxoAutenticacaoProps {
  readonly faseFluxo: FaseFluxo;
  readonly verificandoSessao: boolean;
  readonly onAbrirLogin: () => void;
  readonly onAbrirCadastro: () => void;
  readonly onVoltarLanding: () => void;
  readonly onLoginSucesso: (nome: string, email: string) => void;
}

export function FluxoAutenticacao({
  faseFluxo,
  verificandoSessao,
  onAbrirLogin,
  onAbrirCadastro,
  onVoltarLanding,
  onLoginSucesso,
}: FluxoAutenticacaoProps) {
  const modalAutenticacaoAberto =
    faseFluxo === "login" || faseFluxo === "cadastro";

  const tipoInicial = faseFluxo === "cadastro" ? "cadastro" : "login";

  if (verificandoSessao) {
    return (
      <div className="flex min-h-screen min-w-0 flex-1 items-center justify-center bg-[#fafafc]">
        <output className="flex flex-col items-center gap-4">
          <span
            aria-hidden="true"
            className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#e3e1eb] border-t-[#6962dd] motion-reduce:animate-none"
          />

          <span className="text-sm text-[#686577]">
            Preparando o DermaScan...
          </span>
        </output>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {(faseFluxo === "landing" ||
        faseFluxo === "login" ||
        faseFluxo === "cadastro") && (
        <div
          key="landing"
          className="min-h-screen min-w-0 flex-1 overflow-x-clip"
        >
          <TelaLandingPage
            onAbrirLogin={onAbrirLogin}
            onAbrirCadastro={onAbrirCadastro}
          />

          <ModalAutenticacao
            aberto={modalAutenticacaoAberto}
            onFechar={onVoltarLanding}
          >
            <TelaLoginCadastro
              key={tipoInicial}
              tipoInicial={tipoInicial}
              onLoginSucesso={onLoginSucesso}
            />
          </ModalAutenticacao>
        </div>
      )}
    </AnimatePresence>
  );
}
