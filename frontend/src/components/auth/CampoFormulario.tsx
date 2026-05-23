import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface CampoFormularioProps {
  label: string;
  valor: string;
  placeholder: string;
  tipo?: string;
  carregando: boolean;
  Icone: React.ElementType;
  onChange: (valor: string) => void;
  mostrarAlternadorSenha?: boolean;
  senhaVisivel?: boolean;
  onAlternarSenha?: () => void;
  acaoLabel?: string;
  onAcao?: () => void;
}

export const CampoFormulario: React.FC<CampoFormularioProps> = ({
  label,
  valor,
  placeholder,
  tipo = 'text',
  carregando,
  Icone,
  onChange,
  mostrarAlternadorSenha = false,
  senhaVisivel = false,
  onAlternarSenha,
  acaoLabel,
  onAcao,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center pl-1.5 pr-1">
        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
        {acaoLabel && onAcao && (
          <button
            type="button"
            onClick={onAcao}
            className="text-[10px] text-teal-600 hover:text-teal-700 hover:underline font-bold"
          >
            {acaoLabel}
          </button>
        )}
      </div>

      <div className="relative flex items-center">
        <Icone className="absolute left-4 w-4 h-4 text-slate-400" />
        <input
          type={mostrarAlternadorSenha && senhaVisivel ? 'text' : tipo}
          placeholder={placeholder}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-11 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-slate-800 shadow-sm"
          disabled={carregando}
        />
        {mostrarAlternadorSenha && onAlternarSenha && (
          <button
            type="button"
            onClick={onAlternarSenha}
            className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {senhaVisivel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};



