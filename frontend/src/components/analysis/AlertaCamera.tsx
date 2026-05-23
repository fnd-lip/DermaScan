import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AlertaCameraProps {
  mensagem: string | null;
}

export const AlertaCamera: React.FC<AlertaCameraProps> = ({ mensagem }) => {
  if (!mensagem) return null;

  return (
    <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex gap-2 items-start text-red-800 text-xs">
      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
      <p className="leading-relaxed font-medium">{mensagem}</p>
    </div>
  );
};



