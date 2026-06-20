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
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(20,184,166,0.18),transparent_34%),radial-gradient(circle_at_85%_28%,rgba(99,102,241,0.16),transparent_32%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-950/35 to-slate-950" />

      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-6 md:px-10 lg:px-14 py-6 min-h-screen flex flex-col">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-500/15 border border-teal-400/30 rounded-2xl flex items-center justify-center text-teal-300 shadow-lg shadow-teal-500/10">
              <Shield className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">DermaScan</h1>

              <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-mono mt-1">
                Classificação assistida de lesões
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onAbrirLogin}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-6 py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20"
          >
            Acessar sistema
          </button>
        </header>

        <main className="flex-1 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 xl:gap-16 items-center pt-10 pb-12">
          <section className="max-w-4xl">
            <h2 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.02] tracking-tight">
              A IA que estende sua{" "}
              <span className="bg-linear-to-r from-teal-300 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                visão dermatológica.
              </span>
            </h2>

            <p className="mt-6 max-w-3xl text-slate-300 text-lg xl:text-xl leading-relaxed">
              O DermaScan auxilia na análise visual de lesões dermatológicas,
              apresentando classe provável, confiança, nível de atenção e
              probabilidades para apoiar a triagem inicial.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onAbrirLogin}
                className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black px-6 py-4 rounded-2xl transition-all shadow-xl shadow-teal-500/20"
              >
                Acessar plataforma
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onAbrirCadastro}
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-6 py-4 rounded-2xl transition-all"
              >
                Criar usuário
              </button>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-3 max-w-4xl">
              <MiniCard
                icone={<ImagePlus className="w-5 h-5" />}
                titulo="Envio de imagem"
                texto="Foto ou amostra demonstrativa."
              />

              <MiniCard
                icone={<BrainCircuit className="w-5 h-5" />}
                titulo="Análise por IA"
                texto="Classificação assistida."
              />

              <MiniCard
                icone={<CheckCircle2 className="w-5 h-5" />}
                titulo="Resultado"
                texto="Classe, confiança e atenção."
              />
            </div>
          </section>

          <section className="relative">
            <div className="absolute -inset-6 bg-teal-400/10 rounded-full blur-3xl" />
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
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="w-10 h-10 rounded-xl bg-teal-400/10 text-teal-300 flex items-center justify-center">
        {icone}
      </div>

      <h3 className="mt-3 text-sm font-black text-white">{titulo}</h3>

      <p className="mt-1 text-xs leading-relaxed text-slate-400">{texto}</p>
    </div>
  );
};

interface InfoPainelProps {
  rotulo: string;
  valor: string;
  descricao: string;
}

const InfoPainel: React.FC<InfoPainelProps> = ({
  rotulo,
  valor,
  descricao,
}) => {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <p className="text-[10px] uppercase tracking-widest font-black text-teal-300">
        {rotulo}
      </p>

      <p className="mt-1 text-lg font-black text-white">{valor}</p>

      <p className="mt-0.5 text-[11px] text-slate-400">{descricao}</p>
    </div>
  );
};
