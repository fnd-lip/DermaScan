export function PainelVisualAutenticacao() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#f4f1fc] p-8 lg:flex">
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#777188]">
          Um olhar mais completo
        </span>
      </div>

      <div className="relative mx-auto my-7 flex w-full max-w-64 items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute -inset-3 rotate-5 rounded-t-[7rem] rounded-b-[28px] border border-[#dcd7f0]"
        />

        <img
          src="/assets/landing/medica.jpg"
          alt="Profissional de saúde observando com atenção"
          className="relative z-10 h-52 w-52 -rotate-2 rounded-t-[6.5rem] rounded-b-2xl object-cover object-top shadow-[0_14px_32px_-16px_rgba(36,30,75,0.35)]"
        />
      </div>

      <div className="max-w-sm">
        <h3 className="text-[27px] font-normal leading-[1.16] tracking-[-0.045em] text-[#252137]">
          Cada detalhe conta.
        </h3>

        <p className="mt-1 text-[27px] font-normal leading-[1.16] tracking-[-0.045em] text-[#6962dd]">
          Você faz a diferença.
        </p>

        <p className="mt-4 text-[13px] leading-relaxed text-[#777188]">
          Imagem, contexto e o olhar de quem cuida.
        </p>
      </div>
    </aside>
  );
}
