const criteriosAbcde = [
  {
    letra: "A",
    titulo: "Assimetria",
    descricao:
      "Ao dividir mentalmente o sinal ao meio, observe se os dois lados parecem muito diferentes.",
  },
  {
    letra: "B",
    titulo: "Bordas",
    descricao:
      "Bordas muito irregulares, mal definidas, denteadas ou com contorno incomum merecem atenção.",
  },
  {
    letra: "C",
    titulo: "Cor",
    descricao:
      "Variações de cor no mesmo sinal, como tons muito escuros, avermelhados, azulados ou esbranquiçados, devem ser observadas.",
  },
  {
    letra: "D",
    titulo: "Diâmetro",
    descricao:
      "Sinais maiores que 6 mm merecem atenção, mas alterações menores também podem precisar de avaliação.",
  },
  {
    letra: "E",
    titulo: "Evolução",
    descricao:
      "Mudanças de tamanho, forma, cor, espessura, coceira, ferida ou sangramento ao longo do tempo são pontos importantes.",
  },
];

export const ConteudoABCDE = () => {
  return (
    <div className="space-y-4 text-xs text-slate-700">
      <p className="font-semibold leading-relaxed text-slate-900">
        A regra ABCDE é uma orientação educativa para observar características
        visuais de sinais de pele. Ela não substitui uma avaliação médica.
      </p>

      <div className="grid grid-cols-5 overflow-hidden rounded-xl border border-teal-100 text-center divide-x divide-teal-50">
        {criteriosAbcde.map((criterio) => (
          <div key={criterio.letra} className="bg-teal-50/40 p-2">
            <span className="block text-sm font-extrabold text-teal-800">
              {criterio.letra}
            </span>

            <span className="text-[9px] font-bold uppercase tracking-tight text-slate-500">
              {criterio.titulo}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {criteriosAbcde.map((criterio) => (
          <div key={criterio.letra} className="border-l-4 border-teal-500 pl-3">
            <strong className="block text-xs font-bold text-slate-900">
              {criterio.letra} — {criterio.titulo}
            </strong>

            <p className="mt-0.5 leading-relaxed text-slate-600">
              {criterio.descricao}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};