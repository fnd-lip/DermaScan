import React from 'react';

interface CabecalhoInicioProps {
  nomeUsuario?: string;
}

export const CabecalhoInicio: React.FC<CabecalhoInicioProps> = ({
  nomeUsuario = 'Usuário',
}) => {
  const primeiroNome = nomeUsuario.split(' ')[0];

  return (
    <div>
      <h4 className="text-xs text-teal-600 font-bold uppercase tracking-wider">
        Painel Clínico
      </h4>

      <h2 className="text-xl font-bold text-gray-900 mt-1">
        Olá, {primeiroNome}.
      </h2>

      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
        Vamos classificar uma lesão dermatológica hoje?
      </p>
    </div>
  );
};