import React from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

interface CampoFormularioProps {
  label: string;
  valor: string;
  placeholder: string;
  tipo?: React.HTMLInputTypeAttribute;
  carregando: boolean;
  Icone: LucideIcon;
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
  tipo = "text",
  carregando,
  Icone,
  onChange,
  mostrarAlternadorSenha = false,
  senhaVisivel = false,
  onAlternarSenha,
  acaoLabel,
  onAcao,
}) => {
  const tipoDoCampo = mostrarAlternadorSenha && senhaVisivel ? "text" : tipo;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between pl-1.5 pr-1">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
          {label}
        </label>

        {acaoLabel && onAcao && (
          <button
            type="button"
            onClick={onAcao}
            className="text-[10px] font-bold text-teal-600 hover:text-teal-700 hover:underline"
          >
            {acaoLabel}
          </button>
        )}
      </div>

      <div className="relative flex items-center">
        <Icone className="absolute left-4 h-4 w-4 text-slate-400" />

        <input
          type={tipoDoCampo}
          placeholder={placeholder}
          value={valor}
          onChange={(evento) => onChange(evento.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3 pl-11 pr-11 text-xs font-semibold text-slate-800 shadow-sm transition-all placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          disabled={carregando}
        />

        {mostrarAlternadorSenha && onAlternarSenha && (
          <button
            type="button"
            onClick={onAlternarSenha}
            aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
            title={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {senhaVisivel ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
