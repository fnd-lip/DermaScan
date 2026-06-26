export const ConteudoLesoesDermatologicas = () => {
  return (
    <div className="space-y-2.5 text-xs leading-relaxed text-slate-600">
      <p>
        Uma lesão dermatológica é qualquer alteração visível ou percebida na
        pele, como manchas, pintas, áreas elevadas, feridas, descamações ou
        mudanças de cor.
      </p>

      <ul className="my-2 list-disc space-y-1 pl-4">
        <li>
          <strong className="text-slate-800">Alterações comuns:</strong>{" "}
          Muitas pintas e manchas são benignas e permanecem estáveis ao longo
          do tempo.
        </li>

        <li>
          <strong className="text-slate-800">Sinais de atenção:</strong>{" "}
          Mudanças rápidas, sangramento, feridas que não cicatrizam ou alteração
          importante de cor e formato devem ser avaliadas por um profissional de
          saúde.
        </li>
      </ul>

      <p>
        O DermaScan ajuda a organizar uma análise visual inicial, mas a decisão
        de diagnóstico e conduta pertence ao atendimento médico.
      </p>
    </div>
  );
};