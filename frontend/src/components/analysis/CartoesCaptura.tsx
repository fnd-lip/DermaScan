import React from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface CartoesCapturaProps {
  onAbrirCamera: () => void;
  onAbrirGaleria: () => void;
}

export const CartoesCaptura: React.FC<CartoesCapturaProps> = ({
  onAbrirCamera,
  onAbrirGaleria,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      <BotaoCaptura
        titulo="Tirar foto"
        descricao="Use a câmera do celular para capturar uma imagem da lesão."
        Icone={Camera}
        onClick={onAbrirCamera}
      />
      <BotaoCaptura
        titulo="Escolher da galeria"
        descricao="Selecione uma imagem já salva no seu dispositivo."
        Icone={ImageIcon}
        onClick={onAbrirGaleria}
      />
    </div>
  );
};

interface BotaoCapturaProps {
  titulo: string;
  descricao: string;
  Icone: React.ElementType;
  onClick: () => void;
}

const BotaoCaptura: React.FC<BotaoCapturaProps> = ({ titulo, descricao, Icone, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white hover:bg-slate-50 border border-gray-150 rounded-2xl p-4 text-left flex flex-col gap-3 group transition-all duration-200 active:scale-[0.98] shadow-sm"
    >
      <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-colors">
        <Icone className="w-5 h-5" />
      </div>
      <div>
        <span className="text-xs font-bold text-gray-800 block">{titulo}</span>
        <p className="text-[10px] text-gray-400 mt-1 leading-snug">{descricao}</p>
      </div>
    </button>
  );
};



