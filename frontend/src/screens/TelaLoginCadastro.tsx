import { CheckCircle2 } from "lucide-react";
import { AlertaAutenticacao } from "../components/auth/AlertaAutenticacao";
import { BotaoGoogleAutenticacao } from "../components/auth/BotaoGoogleAutenticacao";
import { DivisorAutenticacao } from "../components/auth/DivisorAutenticacao";
import { FormularioLoginCadastro } from "../components/auth/FormularioLoginCadastro";
import { FormularioRecuperarSenha } from "../components/auth/FormularioRecuperarSenha";
import { PainelVisualAutenticacao } from "../components/auth/PainelVisualAutenticacao";
import { RodapeAutenticacao } from "../components/auth/RodapeAutenticacao";
import { useFormularioAutenticacao } from "../hooks/useFormularioAutenticacao";
import { useLoginGoogle } from "../hooks/useLoginGoogle";

interface TelaLoginCadastroProps {
  readonly onLoginSucesso: (nome: string, email: string) => void;
  readonly tipoInicial: "login" | "cadastro";
}

export function TelaLoginCadastro({
  onLoginSucesso,
  tipoInicial,
}: TelaLoginCadastroProps) {
  const formulario = useFormularioAutenticacao({
    tipoInicial,
    onLoginSucesso,
  });
  const google = useLoginGoogle(onLoginSucesso);

  let titulo = "Bom ter você por aqui.";
  let descricao = "Acesse sua conta para continuar.";

  if (formulario.modoEsqueciSenha) {
    titulo = "Recupere seu acesso.";
    descricao = "Informe seu e-mail para continuar.";
  } else if (formulario.tipo === "cadastro") {
    titulo = "Crie sua conta.";
    descricao = "Cadastre-se para acessar a plataforma.";
  }

  return (
    <div className="grid w-full bg-white lg:grid-cols-2">
      <section className="flex flex-col justify-center px-7 py-7 sm:px-9 lg:px-11">
        <div className="mx-auto w-full max-w-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#686577]">
            SEU ESPAÇO NO DERMASCAN
          </p>

          <h2 className="mt-3 max-w-90 text-4xl font-normal leading-[1.08] tracking-tighter text-[#252137] lg:text-[42px]">
            {titulo}
          </h2>

          <p className="mt-3 text-sm text-[#686577]">{descricao}</p>

          {formulario.mensagemCadastro && (
            <output className="mt-5 flex items-start gap-3 rounded-xl border border-[#dcd8ff] bg-[#f2f0ff] px-4 py-3.5">
              <CheckCircle2
                size={20}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-[#6962dd]"
              />
              <span className="text-[13px] leading-relaxed text-[#39346a]">
                {formulario.mensagemCadastro}
              </span>
            </output>
          )}

          {!formulario.modoEsqueciSenha && (
            <>
              <div className="mt-5">
                <BotaoGoogleAutenticacao
                  onCredencial={(credential) => {
                    void google.autenticarGoogle(credential);
                  }}
                  onErro={google.informarErroGoogle}
                />
              </div>

              {google.carregando && (
                <output className="mt-2 block text-center text-xs text-[#686577]">
                  Conectando sua conta Google...
                </output>
              )}

              <DivisorAutenticacao texto="ou use seu e-mail" />
            </>
          )}

          <AlertaAutenticacao
            erro={google.erro ?? formulario.erro}
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
                carregando={formulario.carregando || google.carregando}
                onChangeNome={formulario.setNome}
                onChangeEmail={formulario.setEmail}
                onChangeSenha={formulario.setSenha}
                onChangeConfirmarSenha={formulario.setConfirmarSenha}
                onAlternarSenha={() =>
                  formulario.setMostrarSenha(!formulario.mostrarSenha)
                }
                onAbrirRecuperacaoSenha={formulario.abrirRecuperacaoSenha}
                onSubmit={formulario.handleSubmit}
              />

              <div className="mt-4">
                <RodapeAutenticacao
                  tipo={formulario.tipo}
                  onAlterarTipo={formulario.alternarTipo}
                />
              </div>
            </>
          )}
        </div>
      </section>
      <PainelVisualAutenticacao />
    </div>
  );
}
