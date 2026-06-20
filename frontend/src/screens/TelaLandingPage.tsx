import React from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ImagePlus,
  Lock,
  ScanSearch,
  Shield,
  Stethoscope,
} from "lucide-react";

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
              <h1 className="text-2xl font-black tracking-tight">
                DermaScan
              </h1>

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

            <div className="relative bg-slate-900/70 border border-white/10 rounded-[2rem] p-6 shadow-2xl shadow-black/30 backdrop-blur-md overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between border border-white/10 bg-slate-950/70 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-teal-300 font-mono">
                      Pipeline de análise
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    CNN / Deep Learning
                  </span>
                </div>

                <div className="mt-8 rounded-3xl border border-teal-400/20 bg-slate-950/70 p-6">
                  <div className="aspect-square max-w-sm mx-auto rounded-full border border-teal-400/20 bg-[radial-gradient(circle,rgba(20,184,166,0.28),rgba(15,23,42,0.1)_45%,transparent_70%)] flex items-center justify-center relative">
                    <div className="absolute inset-8 rounded-full border border-dashed border-teal-300/30 animate-spin" />
                    <div className="absolute inset-16 rounded-full border border-indigo-300/20" />

                    <div className="w-32 h-32 rounded-3xl bg-teal-400/10 border border-teal-300/30 flex items-center justify-center shadow-xl shadow-teal-500/10">
                      <ScanSearch className="w-16 h-16 text-teal-300" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <InfoPainel
                    rotulo="Confiança"
                    valor="0.94"
                    descricao="Escala probabilística"
                  />

                  <InfoPainel
                    rotulo="Atenção"
                    valor="Baixo"
                    descricao="Nível estimado"
                  />
                </div>

                <div className="mt-5 rounded-2xl bg-amber-400/10 border border-amber-300/20 p-4 flex gap-3">
                  <Stethoscope className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />

                  <p className="text-xs leading-relaxed text-amber-50/90">
                    O resultado é informativo e não substitui avaliação médica
                    presencial.
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
                  <Lock className="w-4 h-4 text-teal-300" />
                  Sessão protegida e histórico vinculado ao usuário autenticado.
                </div>
              </div>
            </div>
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