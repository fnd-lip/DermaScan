import React from "react";
import {
  Camera,
  Image as ImageIcon,
  type LucideIcon,
} from "lucide-react";

interface CartoesCapturaProps {
  onAbrirCamera: () => void;
  onAbrirGaleria: () => void;
}

export const CartoesCaptura: React.FC<CartoesCapturaProps> = ({
  onAbrirCamera,
  onAbrirGaleria,
}) => {
  return (
    <div className="grid gap-3.5 sm:grid-cols-2">
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
  Icone: LucideIcon;
  onClick: () => void;
}

const BotaoCaptura: React.FC<BotaoCapturaProps> = ({
  titulo,
  descricao,
  Icone,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-teal-200 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-100">
        <Icone className="h-5 w-5" aria-hidden="true" />
      </div>

      <div>
        <span className="block text-sm font-black text-slate-800">
          {titulo}
        </span>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {descricao}
        </p>
      </div>
    </button>
  );
};