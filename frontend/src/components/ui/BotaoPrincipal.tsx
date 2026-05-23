import React from 'react';
import { juntarClasses } from '../../utils/juntarClasses';

type VarianteBotao = 'primary' | 'secondary' | 'danger' | 'success';

interface BotaoPrincipalProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  titulo: string;
  variante?: VarianteBotao;
  desativado?: boolean;
  icone?: React.ReactNode;
}

const estilosPorVariante: Record<VarianteBotao, string> = {
  primary:
    'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-sm hover:shadow shadow-teal-700/20',
  secondary:
    'bg-teal-50 hover:bg-teal-100 text-teal-700 active:bg-teal-200 border border-teal-100',
  danger:
    'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-650/20',
  success:
    'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm shadow-emerald-650/20',
};

export const BotaoPrincipal: React.FC<BotaoPrincipalProps> = ({
  titulo,
  variante = 'primary',
  desativado = false,
  icone,
  className = '',
  ...props
}) => {
  return (
    <button
      className={juntarClasses(
        'w-full py-3.5 px-6 font-semibold text-sm transition-all duration-200 active:scale-[0.98] outline-none flex items-center justify-center gap-2 rounded-2xl',
        desativado
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          : estilosPorVariante[variante],
        className,
      )}
      disabled={desativado}
      {...props}
    >
      {icone && <span className="w-5 h-5 flex items-center justify-center">{icone}</span>}
      {titulo}
    </button>
  );
};



