import React from "react";
import { AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

import { Predicao } from "../../types/Predicao";
import { formatarPorcentagem } from "../../utils/formatarPorcentagem";
import { obterEstiloRisco } from "../../utils/nivelDeRisco";

interface CartaoResultadoProps {
  predicao: Predicao;
}

const NOMES_CLASSES: Record<string, string> = {
  akiec: "Ceratose actínica",
  bcc: "Carcinoma basocelular",
  bkl: "Ceratose benigna",
  df: "Dermatofibroma",
  mel: "Melanoma",
  nv: "Nevo melanocítico",
  vasc: "Lesão vascular",
};

export const CartaoResultado: React.FC<CartaoResultadoProps> = ({
  predicao,
}) => {
  const estilo = obterEstiloRisco(predicao.nivelAtencao);

  const classesAlertadas = Object.entries(predicao.alertas ?? {})
    .filter(([, ativo]) => ativo)
    .map(([codigo]) => NOMES_CLASSES[codigo] ?? codigo);

  const possuiAlertaAdicional = predicao.alertaAtencao === true;

  const getIcon = () => {
    switch (predicao.nivelAtencao) {
      case "Alto":
        return <ShieldAlert className="h-6 w-6 text-red-600" />;

      case "Atenção":
        return <AlertCircle className="h-6 w-6 text-amber-500" />;

      case "Baixo":
      default:
        return <CheckCircle2 className="h-6 w-6 text-emerald-600" />;
    }
  };

  return (
    <div
      className={`rounded-2xl border border-gray-100 p-4 shadow-sm transition-all duration-300 ${estilo.bg}`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
          {getIcon()}
        </div>

        <div className="flex-1">
          <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Classe mais provável
          </p>

          <h3 className="text-lg font-bold leading-tight text-gray-900">
            {predicao.classePrevista}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-full border border-gray-200 bg-white/90 px-2.5 py-0.5 font-mono text-xs font-medium text-gray-800">
              Confiança:{" "}
              <span className="font-bold">
                {formatarPorcentagem(predicao.confianca)}
              </span>
            </span>

            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${estilo.badge}`}
            >
              Atenção da classe principal: {predicao.nivelAtencao}
            </span>
          </div>
        </div>
      </div>

      {possuiAlertaAdicional && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3"
        >
          <div className="flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

            <div>
              <p className="text-sm font-bold text-amber-900">
                Sinal adicional de atenção
              </p>

              <p className="mt-1 text-xs leading-relaxed text-amber-800">
                Embora a classe mais provável seja{" "}
                <strong>{predicao.classePrevista}</strong>, o modelo identificou
                um sinal secundário relevante
                {classesAlertadas.length > 0 && (
                  <>
                    {" "}
                    para <strong>{classesAlertadas.join(", ")}</strong>
                  </>
                )}
                .
              </p>

              <p className="mt-1 text-xs leading-relaxed text-amber-800">
                Este resultado auxilia apenas na triagem e não substitui uma
                avaliação dermatológica.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3.5 border-t border-gray-200/60 pt-3 text-xs leading-relaxed text-gray-700">
        <strong>Semelhança visual:</strong> A imagem analisada apresenta maior
        semelhança com a classe <strong>{predicao.classePrevista}</strong>, de
        acordo com o modelo computacional de Deep Learning.
      </div>
    </div>
  );
};
