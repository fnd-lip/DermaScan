import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';

interface BotaoAutenticacaoProps {
  tipo: 'login' | 'cadastro' | 'recuperar';
  carregando: boolean;
}

export const BotaoAutenticacao: React.FC<BotaoAutenticacaoProps> = ({ tipo, carregando }) => {
  const conteudo = {
    login: { Icone: LogIn, texto: 'Entrar no Workspace' },
    cadastro: { Icone: UserPlus, texto: 'Registrar Novo Usuário' },
    recuperar: { Icone: LogIn, texto: 'Enviar Chave de Recuperação' },
  }[tipo];

  const Icone = conteudo.Icone;

  return (
    <button
      type="submit"
      disabled={carregando}
      className="w-full mt-2 py-3.5 bg-linear-to-r from-teal-600 to-emerald-600 text-white font-extrabold rounded-2xl text-xs hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/15 disabled:opacity-75 disabled:pointer-events-none"
    >
      {carregando ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <Icone className="w-4 h-4" />
          <span>{conteudo.texto}</span>
        </>
      )}
    </button>
  );
};



