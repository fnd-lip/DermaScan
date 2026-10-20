import { CabecalhoLanding } from "../components/landing/CabecalhoLanding";
import { HeroLanding } from "../components/landing/HeroLanding";
import { SecaoProposta } from "../components/landing/SecaoProposta";
import { SecaoPrincipios } from "../components/landing/SecaoPrincipios";
import { SecaoEditorial } from "../components/landing/SecaoEditorial";
import { SecaoPerguntas } from "../components/landing/SecaoPerguntas";
import { SecaoEncerramento } from "../components/landing/SecaoEncerramento";
import { RodapeLanding } from "../components/landing/RodapeLanding";
import { ProvedorMovimentoLanding } from "../components/landing/MovimentoLanding";

interface TelaLandingPageProps {
  readonly onAbrirLogin: () => void;
  readonly onAbrirCadastro: () => void;
}

export function TelaLandingPage({
  onAbrirLogin,
  onAbrirCadastro,
}: TelaLandingPageProps) {
  return (
    <ProvedorMovimentoLanding>
      <div className="relative min-h-screen w-full overflow-x-clip bg-[#fafafc] font-landing text-[#252137] selection:bg-[#d5d1f7]">
        <a
          href="#conteudo"
          className="sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4 focus:not-sr-only"
        >
          Ir para o conteúdo
        </a>

        <CabecalhoLanding onAbrirLogin={onAbrirLogin} />

        <main id="conteudo">
          <HeroLanding />
          <SecaoProposta />
          <SecaoPrincipios />
          <SecaoEditorial />
          <SecaoPerguntas />
          <SecaoEncerramento onAbrirCadastro={onAbrirCadastro} />
        </main>

        <RodapeLanding />
      </div>
    </ProvedorMovimentoLanding>
  );
}
