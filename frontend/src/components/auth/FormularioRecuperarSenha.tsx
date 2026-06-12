import React from 'react';
import { Mail } from 'lucide-react';
import { CampoFormulario } from './CampoFormulario';
import { BotaoAutenticacao } from './BotaoAutenticacao';

interface FormularioRecuperarSenhaProps {
  emailEsquecido: string;
  carregando: boolean;
  onChangeEmail: (valor: string) => void;
  onSubmit: (evento: React.FormEvent) => void;
  onVoltar: () => void;
}

export const FormularioRecuperarSenha: React.FC<FormularioRecuperarSenhaProps> = ({
  emailEsquecido,
  carregando,
  onChangeEmail,
  onSubmit,
  onVoltar,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <CampoFormulario
        label="Seu E-mail Cadastrado"
        tipo="email"
        placeholder="E-mail"
        valor={emailEsquecido}
        carregando={carregando}
        Icone={Mail}
        onChange={onChangeEmail}
      />

      <BotaoAutenticacao tipo="recuperar" carregando={carregando} />

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onVoltar}
          className="text-xs text-slate-500 hover:text-teal-700 font-bold hover:underline"
        >
          Voltar para o Login
        </button>
      </div>
    </form>
  );
};



