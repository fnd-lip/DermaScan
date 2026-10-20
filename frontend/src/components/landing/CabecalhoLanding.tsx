interface CabecalhoLandingProps {
  readonly onAbrirLogin: () => void;
}

const links = [
  { href: "#proposta", texto: "A proposta" },
  { href: "#principios", texto: "Nosso olhar" },
  { href: "#perguntas", texto: "Perguntas" },
] as const;

export function CabecalhoLanding({ onAbrirLogin }: CabecalhoLandingProps) {
  return (
    <header className="relative z-20 mx-auto flex h-20 w-full max-w-360 items-center justify-between gap-4 px-[5.5%] min-[701px]:h-25">
      <a
        href="#inicio"
        aria-label="DermaScan, início"
        className="inline-flex shrink-0 items-center gap-2 text-[21px] font-[650] tracking-[-1.2px] whitespace-nowrap text-[#252137] no-underline min-[701px]:text-2xl"
      >
        <svg
          viewBox="0 0 46 46"
          aria-hidden="true"
          className="h-7.5 w-7.5 fill-none stroke-[#6962dd] stroke-3 min-[701px]:h-9 min-[701px]:w-9"
          strokeLinecap="round"
        >
          <path d="M22.5 5C12.3 5 5 13 5 23s7.3 18 17.5 18M23 13c-6 0-10 4.3-10 10s4 10 10 10M29 13a10 10 0 0 1 4 4" />
          <circle cx="33" cy="8" r="4" />
          <circle cx="26" cy="23" r="2" />
        </svg>

        <span>DermaScan</span>
      </a>

      <nav
        aria-label="Navegação principal"
        className="hidden items-center gap-8 text-[13px] font-semibold min-[701px]:flex"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="relative whitespace-nowrap text-[#252137] no-underline outline-offset-4 transition-colors after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#6962dd] after:content-[''] after:transition-transform after:duration-300 hover:text-[#6962dd] hover:after:scale-x-100 focus-visible:after:scale-x-100 motion-reduce:after:transition-none"
          >
            {link.texto}
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={onAbrirLogin}
        className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-4 rounded-[10px] border border-[#e3e1eb] bg-white px-4 py-2.5 text-xs font-normal text-[#252137] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#eeecfa] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6962dd] min-[701px]:gap-7.5 min-[701px]:px-[21px] min-[701px]:py-3 min-[701px]:text-[13px]"
      >
        <span>Entrar</span>
        <span aria-hidden="true">↗</span>
      </button>
    </header>
  );
}
