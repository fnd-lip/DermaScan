import React from 'react';
import { AnimatePresence } from 'motion/react';
import { FaseFluxo } from '../../app/types/fluxo';
import { FluxoCentralizado } from '../layout/FluxoCentralizado';
import { TelaLoginCadastro } from '../../screens/TelaLoginCadastro';
import { TelaDeApresentacao } from '../../screens/TelaDeApresentacao';
import { TelaAvisoMedico } from '../../screens/TelaAvisoMedico';

interface FluxoAutenticacaoProps {
  faseFluxo: FaseFluxo;
  onLoginSucesso: (nome: string, email: string) => void;
  onCadastroSucesso: (nome: string, email: string) => void;
  onFinalizarOnboarding: () => void;
  onAceitarAvisoMedico: () => void;
}

export const FluxoAutenticacao: React.FC<FluxoAutenticacaoProps> = ({
  faseFluxo,
  onLoginSucesso,
  onCadastroSucesso,
  onFinalizarOnboarding,
  onAceitarAvisoMedico,
}) => {
  return (
    <AnimatePresence mode="wait">
      {faseFluxo === 'login' && (
        <FluxoCentralizado key="login" className="max-w-lg">
          <TelaLoginCadastro
            tipoInicial="login"
            onLoginSucesso={onLoginSucesso}
            onCadastroSucesso={onCadastroSucesso}
          />
        </FluxoCentralizado>
      )}

      {faseFluxo === 'cadastro' && (
        <FluxoCentralizado key="cadastro" className="max-w-lg">
          <TelaLoginCadastro
            tipoInicial="cadastro"
            onLoginSucesso={onLoginSucesso}
            onCadastroSucesso={onCadastroSucesso}
          />
        </FluxoCentralizado>
      )}

      {faseFluxo === 'onboarding' && (
        <FluxoCentralizado key="onboarding" className="max-w-xl min-h-[520px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col">
          <TelaDeApresentacao onFinalizarOnboarding={onFinalizarOnboarding} />
        </FluxoCentralizado>
      )}

      {faseFluxo === 'aviso_medico' && (
        <FluxoCentralizado key="aviso_medico" className="max-w-xl min-h-[540px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col">
          <TelaAvisoMedico onAceitarAviso={onAceitarAvisoMedico} />
        </FluxoCentralizado>
      )}
    </AnimatePresence>
  );
};



