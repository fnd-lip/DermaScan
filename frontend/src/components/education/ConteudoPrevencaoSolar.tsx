export const ConteudoPrevencaoSolar = () => {
  return (
    <div className="space-y-2.5 text-xs leading-relaxed text-slate-600">
      <p>
        A exposição solar acumulada pode prejudicar a pele ao longo do tempo.
        Alguns cuidados simples ajudam na prevenção diária.
      </p>

      <ul className="list-decimal space-y-1 pl-4">
        <li>
          <strong className="text-slate-800">Use protetor solar:</strong>{" "}
          Aplique um produto adequado para sua pele e reaplique conforme a
          orientação do fabricante.
        </li>

        <li>
          <strong className="text-slate-800">Evite horários de maior sol:</strong>{" "}
          Sempre que possível, reduza a exposição direta entre 10h e 16h.
        </li>

        <li>
          <strong className="text-slate-800">Use proteção física:</strong>{" "}
          Chapéus, óculos de sol e roupas que cubram a pele ajudam a reduzir a
          exposição.
        </li>
      </ul>
    </div>
  );
};