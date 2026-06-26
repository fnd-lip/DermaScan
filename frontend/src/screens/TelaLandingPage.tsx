import React from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ImagePlus,
  Shield,
} from "lucide-react";
import { CenaClassificacaoIA } from "../components/scene/CenaClassificacaoIA";

interface TelaLandingPageProps {
  onAbrirLogin: () => void;
  onAbrirCadastro: () => void;
}

export const TelaLandingPage: React.FC<TelaLandingPageProps> = ({
  onAbrirLogin,
  onAbrirCadastro,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 font-sans text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(20,184,166,0.18),transparent_34%),radial-gradient(circle_at_85%_28%,rgba(99,102,241,0.16),transparent_32%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-950/35 to-slate-950" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-420 flex-col px-6 py-6 md:px-10 lg:px-14">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-400/30 bg-teal-500/15 text-teal-300 shadow-lg shadow-teal-500/10">
              <Shield className="h-6 w-6" aria-hidden="true" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                DermaScan
              </h1>

              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">
                Classificação assistida de lesões
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAbrirLogin}
            className="rounded-xl bg-teal-500 px-6 py-3 font-black text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-400"
          >
            Acessar sistema
          </button>
        </header>

        <main className="grid flex-1 items-center gap-10 pb-12 pt-10 lg:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          <section className="max-w-4xl">
            <h2 className="text-5xl font-black leading-[1.02] tracking-tight md:text-6xl xl:text-7xl">
              A IA que estende sua{" "}
              <span className="bg-linear-to-r from-teal-300 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                visão dermatológica.
              </span>
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 xl:text-xl">
              O DermaScan auxilia na análise visual de lesões dermatológicas,
              apresentando classe provável, confiança, nível de atenção e
              probabilidades para apoiar a triagem inicial.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onAbrirLogin}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 px-6 py-4 font-black text-slate-950 shadow-xl shadow-teal-500/20 transition-all hover:bg-teal-400"
              >
                Acessar plataforma
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onAbrirCadastro}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all hover:bg-white/10"
              >
                Criar usuário
              </button>
            </div>

            <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
              <MiniCard
                icone={<ImagePlus className="h-5 w-5" aria-hidden="true" />}
                titulo="Envio de imagem"
                texto="Foto ou amostra demonstrativa."
              />

              <MiniCard
                icone={<BrainCircuit className="h-5 w-5" aria-hidden="true" />}
                titulo="Análise por IA"
                texto="Classificação assistida."
              />

              <MiniCard
                icone={<CheckCircle2 className="h-5 w-5" aria-hidden="true" />}
                titulo="Resultado"
                texto="Classe, confiança e atenção."
              />
            </div>
          </section>

          <section className="relative">
            <div className="absolute -inset-6 rounded-full bg-teal-400/10 blur-3xl" />
            <CenaClassificacaoIA />
          </section>
        </main>
      </div>
    </div>
  );
};

interface MiniCardProps {
  icone: React.ReactNode;
  titulo: string;
  texto: string;
}

const MiniCard: React.FC<MiniCardProps> = ({ icone, titulo, texto }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
        {icone}
      </div>

      <h3 className="mt-3 text-sm font-black text-white">{titulo}</h3>

      <p className="mt-1 text-xs leading-relaxed text-slate-400">{texto}</p>
    </div>
  );
};