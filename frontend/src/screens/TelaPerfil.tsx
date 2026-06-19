import React from "react";
import { BotaoLogoutPerfil } from "../components/profile/BotaoLogoutPerfil";
import { CabecalhoPerfil } from "../components/profile/CabecalhoPerfil";
import { SecoesInformativasPerfil } from "../components/profile/SecoesInformativasPerfil";

interface TelaPerfilProps {
  onRecarregarApp: () => void;
  historicoCount: number;
  nomeUsuario?: string;
  emailUsuario?: string;
  onSairDaConta?: () => void | Promise<void>;
}

export const TelaPerfil: React.FC<TelaPerfilProps> = ({
  onRecarregarApp,
  historicoCount,
  nomeUsuario = "Usuário",
  emailUsuario = "E-mail não informado",
  onSairDaConta,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-gray-800 p-5 overflow-y-auto font-sans pb-20 select-none">
      <CabecalhoPerfil
        nomeUsuario={nomeUsuario}
        emailUsuario={emailUsuario}
        historicoCount={historicoCount}
      />

      <SecoesInformativasPerfil />

      <BotaoLogoutPerfil
        onRecarregarApp={onRecarregarApp}
        onSairDaConta={onSairDaConta}
      />
    </div>
  );
};