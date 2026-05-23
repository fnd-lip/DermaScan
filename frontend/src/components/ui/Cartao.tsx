import React from 'react';
import { juntarClasses } from '../../utils/juntarClasses';

interface CartaoProps {
  children: React.ReactNode;
  className?: string;
}

export const Cartao: React.FC<CartaoProps> = ({ children, className = '' }) => {
  return (
    <div
      className={juntarClasses(
        'bg-white border border-gray-100 rounded-2xl shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  );
};



