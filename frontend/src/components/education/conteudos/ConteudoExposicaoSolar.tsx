import React from "react";

export const ConteudoExposicaoSolar: React.FC = () => {
  return (
    <div className="space-y-2.5 text-xs leading-relaxed text-slate-600">
      <p>
        A exposição solar sem proteção pode causar danos cumulativos à pele. A
        prevenção diária ajuda a reduzir riscos e preservar a saúde cutânea.
      </p>

      <ul className="list-decimal space-y-1 pl-4">
        <li>
          <strong>Use protetor solar:</strong> aplique fotoproteção adequada para
          sua pele e reaplique conforme orientação do produto.
        </li>

        <li>
          <strong>Evite horários de maior radiação:</strong> sempre que possível,
          reduza exposição direta entre 10h e 16h.
        </li>

        <li>
          <strong>Use barreiras físicas:</strong> chapéus, óculos com proteção UV
          e roupas que cubram áreas expostas ajudam na proteção.
        </li>
      </ul>
    </div>
  );
};
