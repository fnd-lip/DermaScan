import React from "react";

export const ConteudoLimitacoesIA: React.FC = () => {
  return (
    <div className="space-y-2.5 text-xs leading-relaxed text-slate-600">
      <p>
        A inteligência artificial pode auxiliar na análise visual de imagens,
        mas possui limites importantes.
      </p>

      <ul className="list-disc space-y-1 pl-4">
        <li>
          <strong>Qualidade da imagem:</strong> iluminação ruim, falta de foco,
          sombras, pelos, reflexos ou enquadramento inadequado podem afetar o
          resultado.
        </li>

        <li>
          <strong>Ausência de contexto clínico:</strong> a IA analisa apenas a
          imagem enviada. Ela não avalia histórico familiar, sintomas, evolução
          da lesão ou exames presenciais.
        </li>

        <li>
          <strong>Não substitui avaliação médica:</strong> o resultado é uma
          estimativa visual e não deve ser interpretado como diagnóstico ou
          laudo médico.
        </li>
      </ul>
    </div>
  );
};
