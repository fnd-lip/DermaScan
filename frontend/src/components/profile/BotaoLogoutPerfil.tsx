import React, { useState } from "react";
import { LogOut } from "lucide-react";

interface BotaoLogoutPerfilProps {
  onRecarregarApp: () => void;
  onSairDaConta?: () => void | Promise<void>;
}

export const BotaoLogoutPerfil: React.FC<BotaoLogoutPerfilProps> = ({
  onRecarregarApp,
  onSairDaConta,
}) => {
  const [confirmandoSair, setConfirmandoSair] = useState(false);

  const confirmarSaida = () => {
    setConfirmandoSair(false);

    if (onSairDaConta) {
      void onSairDaConta();
      return;
    }

    onRecarregarApp();
  };

  if (confirmandoSair) {
    return (
      <div className="pt-3">
        <div className="bg-red-50 border border-red-150 rounded-2xl p-4.5 flex flex-col items-center text-center space-y-3 animate-fadeIn">
          <p className="text-xs font-extrabold text-red-800">
            Deseja realmente sair da sua conta?
          </p>

          <p className="text-[10px] text-red-650/80 leading-snug">
            Sua sessão clínica ativa será encerrada. Será necessário se
            reautenticar com e-mail e senha.
          </p>

          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={confirmarSaida}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Sim, sair
            </button>

            <button
              type="button"
              onClick={() => setConfirmandoSair(false)}
              className="flex-1 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-3">
      <button
        type="button"
        onClick={() => setConfirmandoSair(true)}
        className="w-full py-3.5 text-center font-bold text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-2xl transition-all flex items-center justify-center gap-1.5 border border-red-100 shadow-xs active:scale-[0.99]"
      >
        <LogOut className="w-4 h-4" />
        Sair da conta
      </button>
    </div>
  );
};
