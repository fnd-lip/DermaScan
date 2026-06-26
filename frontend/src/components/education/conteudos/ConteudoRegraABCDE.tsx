import React from "react";

const letrasAbcde = [
  { letra: "A", nome: "Assimetria" },
  { letra: "B", nome: "Bordas" },
  { letra: "C", nome: "Cor" },
  { letra: "D", nome: "Diâmetro" },
  { letra: "E", nome: "Evolução" },
];

const explicacoesAbcde = [
  {
    titulo: "A — Assimetria",
    texto:
      "Observe se os dois lados da pinta ou mancha parecem diferentes quando imaginamos uma linha dividindo a lesão ao meio.",
  },
  {
    titulo: "B — Bordas",
    texto:
      "Bordas muito irregulares, mal delimitadas, denteadas ou com contorno pouco claro merecem atenção.",
  },
  {
    titulo: "C — Cor",
    texto:
      "Variações importantes de cor em uma mesma lesão, como tons muito escuros, avermelhados, azulados ou esbranquiçados, devem ser acompanhadas.",
  },
  {
    titulo: "D — Diâmetro",
    texto:
      "Lesões maiores que 6 milímetros podem exigir mais atenção, principalmente quando associadas a outros sinais visuais.",
  },
  {
    titulo: "E — Evolução",
    texto:
      "Mudanças de tamanho, cor, formato, espessura, coceira, feridas ou sangramento ao longo do tempo são sinais importantes para buscar avaliação profissional.",
  },
];

export const ConteudoRegraABCDE: React.FC = () => {
  return (
    <div className="space-y-4 text-xs text-slate-700">
      <p className="font-semibold text-slate-900">
        A regra ABCDE é uma referência simples para observar alterações em pintas
        e manchas que podem merecer avaliação de um profissional de saúde.
      </p>

      <div className="grid grid-cols-5 divide-x divide-teal-50 overflow-hidden rounded-xl border border-teal-100 text-center">
        {letrasAbcde.map((item) => (
          <div key={item.letra} className="bg-teal-50/40 p-2">
            <span className="block text-sm font-black text-teal-800">
              {item.letra}
            </span>

            <span className="text-[9px] font-bold uppercase tracking-tight text-slate-500">
              {item.nome}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {explicacoesAbcde.map((item) => (
          <div key={item.titulo} className="border-l-3 border-teal-500 pl-3.5">
            <strong className="block text-xs font-bold text-slate-900">
              {item.titulo}
            </strong>

            <p className="mt-0.5 leading-relaxed text-slate-600">
              {item.texto}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
