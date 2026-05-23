import React from 'react';
import { CabecalhoAutenticacao } from '../components/auth/CabecalhoAutenticacao';
import { AlertaAutenticacao, AvisoClinicoAutenticacao } from '../components/auth/AlertaAutenticacao';
import { FormularioLoginCadastro } from '../components/auth/FormularioLoginCadastro';
import { FormularioRecuperarSenha } from '../components/auth/FormularioRecuperarSenha';
import { RodapeAutenticacao } from '../components/auth/RodapeAutenticacao';
import { useFormularioAutenticacao } from '../hooks/useFormularioAutenticacao';

interface TelaLoginCadastroProps {
  onLoginSucesso: (nome: string, email: string) => void;
  onCadastroSucesso: (nome: string, email: string) => void;
  tipoInicial: 'login' | 'cadastro';
}

export const TelaLoginCadastro: React.FC<TelaLoginCadastroProps> = ({
  onLoginSucesso,
  onCadastroSucesso,
  tipoInicial,
}) => {
  const formulario = useFormularioAutenticacao({
    tipoInicial,
    onLoginSucesso,
    onCadastroSucesso,
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-linear-to-tr from-slate-50 via-teal-50/10 to-indigo-50/20 min-h-[580px] font-sans relative overflow-hidden">
      <div className="absolute top-1/4 -left-16 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-16 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/60 p-8 shadow-2xl shadow-teal-900/5 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-teal-500 via-emerald-500 to-indigo-600 animate-gradient" />

        <CabecalhoAutenticacao
          tipo={formulario.tipo}
          modoEsqueciSenha={formulario.modoEsqueciSenha}
        />

        <AvisoClinicoAutenticacao />
        <AlertaAutenticacao
          erro={formulario.erro}
          mensagemEsqueci={formulario.mensagemEsqueci}
        />

        {formulario.modoEsqueciSenha ? (
          <FormularioRecuperarSenha
            emailEsquecido={formulario.emailEsquecido}
            carregando={formulario.carregando}
            onChangeEmail={formulario.setEmailEsquecido}
            onSubmit={formulario.handleRecuperarSenha}
            onVoltar={formulario.voltarParaLogin}
          />
        ) : (
          <>
            <FormularioLoginCadastro
              tipo={formulario.tipo}
              nome={formulario.nome}
              email={formulario.email}
              senha={formulario.senha}
              confirmarSenha={formulario.confirmarSenha}
              mostrarSenha={formulario.mostrarSenha}
              carregando={formulario.carregando}
              onChangeNome={formulario.setNome}
              onChangeEmail={formulario.setEmail}
              onChangeSenha={formulario.setSenha}
              onChangeConfirmarSenha={formulario.setConfirmarSenha}
              onAlternarSenha={() => formulario.setMostrarSenha(!formulario.mostrarSenha)}
              onAbrirRecuperacaoSenha={formulario.abrirRecuperacaoSenha}
              onSubmit={formulario.handleSubmit}
            />

            <RodapeAutenticacao
              tipo={formulario.tipo}
              onAlterarTipo={formulario.alternarTipo}
            />
          </>
        )}
      </div>
    </div>
  );
};



