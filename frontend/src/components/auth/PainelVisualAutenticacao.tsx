export function PainelVisualAutenticacao() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#f2eefc] p-7 lg:flex">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-semibold tracking-[0.16em] text-[#686577]">
          UM OLHAR MAIS COMPLETO
        </span>
      </div>

      {/* Fotografia da médica */}
      <div className="relative mx-auto my-5 flex w-full max-w-70 items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute -inset-3 rotate-6 rounded-t-[8rem] rounded-b-3xl border border-[#d6d2ee]"
        />

        <img
          src="/assets/landing/medica.jpg"
          alt="Profissional de saúde observando com atenção"
          className="relative z-10 h-60 w-60 -rotate-3 rounded-t-[7rem] rounded-b-2xl object-cover object-top shadow-lg"
        />
      </div>

      {/* Mensagem institucional */}
      <div>
        <h3 className="text-3xl font-normal leading-tight tracking-tighter text-[#252137]">
          Cada detalhe conta.
        </h3>

        <p className="text-3xl font-normal leading-tight tracking-tighter text-[#6962dd]">
          Você faz a diferença.
        </p>

        <p className="mt-3 text-xs text-[#686577]">
          Imagem, contexto e o olhar de quem cuida.
        </p>
      </div>
    </aside>
  );
}
