export const ConteudoLimitacoesIA = () => {
  return (
    <div className="space-y-2.5 text-xs leading-relaxed text-slate-600">
      <p>
        A inteligência artificial pode auxiliar na análise visual de imagens,
        mas possui limitações importantes.
      </p>

      <ul className="list-disc space-y-1 pl-4">
        <li>
          <strong className="text-slate-800">Qualidade da imagem:</strong>{" "}
          Iluminação ruim, falta de foco, sombra, pelos ou imagem cortada podem
          reduzir a confiabilidade da análise.
        </li>

        <li>
          <strong className="text-slate-800">Contexto incompleto:</strong>{" "}
          A imagem não mostra histórico familiar, sintomas, tempo de evolução ou
          outros fatores avaliados em consulta.
        </li>

        <li>
          <strong className="text-slate-800">Não é diagnóstico:</strong>{" "}
          O resultado é uma estimativa visual assistida e não substitui consulta,
          laudo ou orientação médica.
        </li>
      </ul>
    </div>
  );
};