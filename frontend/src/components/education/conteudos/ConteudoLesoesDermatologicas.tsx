import React from "react";

export const ConteudoLesoesDermatologicas: React.FC = () => {
  return (
    <div className="space-y-2.5 text-xs leading-relaxed text-slate-600">
      <p>
        Uma lesão dermatológica é qualquer alteração visível ou perceptível na
        pele, como manchas, pintas, feridas, placas, elevações ou mudanças de
        textura.
      </p>

      <ul className="my-2 list-disc space-y-1 pl-4">
        <li>
          <strong>Alterações comuns:</strong> podem incluir pintas, manchas,
          ressecamentos, pequenas elevações ou marcas estáveis ao longo do tempo.
        </li>

        <li>
          <strong>Alterações que merecem atenção:</strong> incluem lesões que
          mudam rapidamente, apresentam sangramento, coceira persistente, bordas
          irregulares ou variações importantes de cor.
        </li>
      </ul>

      <p>
        O acompanhamento profissional continua sendo essencial. A análise por IA
        deve ser entendida como apoio visual, não como diagnóstico.
      </p>
    </div>
  );
};
