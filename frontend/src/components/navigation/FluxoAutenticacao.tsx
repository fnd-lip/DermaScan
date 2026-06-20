import React from 'react';
import { AnimatePresence } from 'motion/react';
import { FaseFluxo } from '../../app/types/fluxo';
import { FluxoCentralizado } from '../layout/FluxoCentralizado';
import { TelaLoginCadastro } from '../../screens/TelaLoginCadastro';
import { TelaDeApresentacao } from '../../screens/TelaDeApresentacao';
import { TelaAvisoMedico } from '../../screens/TelaAvisoMedico';
import { TelaLandingPage } from '../../screens/TelaLandingPage';
import { ModalAutenticacao } from '../auth/ModalAutenticacao';

interface FluxoAutenticacaoProps {
  faseFluxo: FaseFluxo;
  onAbrirLogin: () => void;
  onAbrirCadastro: () => void;
  onVoltarLanding: () => void;
  onLoginSucesso: (nome: string, email: string) => void;
  onCadastroSucesso: (nome: string, email: string) => void;
  onFinalizarOnboarding: () => void;
  onAceitarAvisoMedico: () => void;
}

export const FluxoAutenticacao: React.FC<FluxoAutenticacaoProps> = ({
  faseFluxo,
  onAbrirLogin,
  onAbrirCadastro,
  onVoltarLanding,
  onLoginSucesso,
  onCadastroSucesso,
  onFinalizarOnboarding,
  onAceitarAvisoMedico,
}) => {
  const modalAutenticacaoAberto =
    faseFluxo === 'login' || faseFluxo === 'cadastro';

  const tipoInicial = faseFluxo === 'cadastro' ? 'cadastro' : 'login';

  return (
    <AnimatePresence mode="wait">
      {(faseFluxo === 'landing' ||
        faseFluxo === 'login' ||
        faseFluxo === 'cadastro') && (
        <div key="landing" className="-m-6 flex-1 min-h-screen overflow-hidden">
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
              onCadastroSucesso={onCadastroSucesso}
            />
          </ModalAutenticacao>
        </div>
      )}

      {faseFluxo === 'onboarding' && (
        <FluxoCentralizado
          key="onboarding"
          className="max-w-xl min-h-[520px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col"
        >
          <TelaDeApresentacao onFinalizarOnboarding={onFinalizarOnboarding} />
        </FluxoCentralizado>
      )}

      {faseFluxo === 'aviso_medico' && (
        <FluxoCentralizado
          key="aviso_medico"
          className="max-w-xl min-h-[540px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col"
        >
          <TelaAvisoMedico onAceitarAviso={onAceitarAvisoMedico} />
        </FluxoCentralizado>
      )}
    </AnimatePresence>
  );
};