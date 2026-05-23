import React from 'react';
import { juntarClasses } from '../../utils/juntarClasses';

interface FluxoCentralizadoProps {
  children: React.ReactNode;
  className?: string;
}

export const FluxoCentralizado: React.FC<FluxoCentralizadoProps> = ({
  children,
  className,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className={juntarClasses('w-full', className)}>
        {children}
      </div>
    </div>
  );
};



