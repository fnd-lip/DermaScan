import React from 'react';
import { juntarClasses } from '../../utils/juntarClasses';

interface TelaBaseProps {
  children: React.ReactNode;
  className?: string;
  comScroll?: boolean;
}

export const TelaBase: React.FC<TelaBaseProps> = ({
  children,
  className = '',
  comScroll = true,
}) => {
  return (
    <div
      className={juntarClasses(
        'h-full font-sans select-none',
        comScroll && 'overflow-y-auto',
        className,
      )}
    >
      {children}
    </div>
  );
};



