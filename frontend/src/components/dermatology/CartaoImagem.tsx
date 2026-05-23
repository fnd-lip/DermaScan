import React from 'react';
import { Scan } from 'lucide-react';

interface CartaoImagemProps {
  uri: string;
  mostrarGuia?: boolean;
}

export const CartaoImagem: React.FC<CartaoImagemProps> = ({ uri, mostrarGuia = false }) => {
  return (
    <div className="relative w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden shadow-md flex items-center justify-center border border-gray-200">
      <img
        src={uri}
        alt="Lesão de pele"
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      {mostrarGuia && (
        <div className="absolute inset-4 border border-dashed border-teal-400/50 rounded-xl pointer-events-none flex flex-col items-center justify-center">
          <div className="text-teal-400 animate-pulse mb-1">
            <Scan className="w-12 h-12" />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-teal-400 bg-teal-950/80 px-2.5 py-1 text-center font-mono border border-teal-500/30 rounded-md">
            Alinhamento Neural CNN
          </p>
        </div>
      )}
    </div>
  );
};



