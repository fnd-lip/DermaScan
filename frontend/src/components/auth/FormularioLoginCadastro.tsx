import React from 'react';
import { Lock, Mail, User } from 'lucide-react';
import { CampoFormulario } from './CampoFormulario';
import { BotaoAutenticacao } from './BotaoAutenticacao';

interface FormularioLoginCadastroProps {
  tipo: 'login' | 'cadastro';
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  mostrarSenha: boolean;
  carregando: boolean;
  onChangeNome: (valor: string) => void;
  onChangeEmail: (valor: string) => void;
  onChangeSenha: (valor: string) => void;
  onChangeConfirmarSenha: (valor: string) => void;
  onAlternarSenha: () => void;
  onAbrirRecuperacaoSenha: () => void;
  onSubmit: (evento: React.FormEvent) => void;
}

export const FormularioLoginCadastro: React.FC<FormularioLoginCadastroProps> = ({
  tipo,
  nome,
  email,
  senha,
  confirmarSenha,
  mostrarSenha,
  carregando,
  onChangeNome,
  onChangeEmail,
  onChangeSenha,
  onChangeConfirmarSenha,
  onAlternarSenha,
  onAbrirRecuperacaoSenha,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {tipo === 'cadastro' && (
        <CampoFormulario
          label="Nome Completo do Clínico"
          placeholder="Ex: Usuário Demo"
          valor={nome}
          carregando={carregando}
          Icone={User}
          onChange={onChangeNome}
        />
      )}

      <CampoFormulario
        label="Endereço de E-mail"
        tipo="email"
        placeholder="felipefebl@gmail.com"
        valor={email}
        carregando={carregando}
        Icone={Mail}
        onChange={onChangeEmail}
      />

      <CampoFormulario
        label="Senha de Acesso"
        tipo="password"
        placeholder="Mínimo de 6 dígitos"
        valor={senha}
        carregando={carregando}
        Icone={Lock}
        onChange={onChangeSenha}
        mostrarAlternadorSenha
        senhaVisivel={mostrarSenha}
        onAlternarSenha={onAlternarSenha}
        acaoLabel={tipo === 'login' ? 'Esqueceu sua senha?' : undefined}
        onAcao={tipo === 'login' ? onAbrirRecuperacaoSenha : undefined}
      />

      {tipo === 'cadastro' && (
        <CampoFormulario
          label="Confirmar Senha"
          tipo="password"
          placeholder="Confirme sua senha"
          valor={confirmarSenha}
          carregando={carregando}
          Icone={Lock}
          onChange={onChangeConfirmarSenha}
        />
      )}

      <BotaoAutenticacao tipo={tipo} carregando={carregando} />
    </form>
  );
};



