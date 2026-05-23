import React, { useState } from "react";
import { Predicao } from "../types/Predicao";
import { BotaoPrincipal } from "../components/ui/BotaoPrincipal";
import { CartaoResultado } from "../components/dermatology/CartaoResultado";
import { BarraProbabilidade } from "../components/ui/BarraProbabilidade";
import { CartaoAvisoMedico } from "../components/dermatology/CartaoAvisoMedico";
import {
  Award,
  PlusCircle,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Save,
} from "lucide-react";

interface TelaResultadoProps {
  predicao: Predicao;
  imagemUri: string;
  onNovaAnalise: () => void;
  onSalvarNoHistorico: () => void;
  salvo: boolean;
}

// Medical dictionary descriptions for Brazilian Portuguese
const DESCRICOES_CLASSES: {
  [key: string]: { sintomas: string; acao: string; detalhe: string };
} = {
  Melanoma: {
    sintomas:
      "Lesão altamente assimétrica, bordas denteadas, múltiplos matizes escuros e evolução rápida.",
    acao: "Requer avaliação diagnóstica presencial urgente por especialista dermatologista e realização de biópsia.",
    detalhe:
      "O melanoma maligno origina-se nos melanócitos produtores de pigmento de pele. Representa a variante mais severa entre tumores cutâneos e o diagnóstico inicial precoce é o maior preditivo de cura.",
  },
  "Carcinoma basocelular": {
    sintomas:
      "Pápula perolizada brilhante, nódulos com relevo sutil, pequenas ulcerações centrais ou vasos finos.",
    acao: "Agende uma avaliação com dermatologista para confirmação histológica e planejamento terapêutico de remoção.",
    detalhe:
      "É o tumor de pele mais comum globalmente. Possui crescimento lento e localização preferencial em regiões de constante radiação solar. Apresenta raríssimo potencial de metástase distante, porém invasão tecidual local pronunciada.",
  },
  "Ceratose actínica": {
    sintomas:
      "Placas descamativas arenosas ásperas ao toque, avermelhadas, localizadas em áreas de exposição solar crônica.",
    acao: "Consulte um dermatologista. Trata-se de uma lesão precursora que deve ser removida preventivamente.",
    detalhe:
      "Considerada uma lesão pré-cancerosa epitelial. Se negligenciada por anos, pode evoluir para carcinoma espinocelular. O tratamento médico inclui crioterapia, terapia fotodinâmica ou pomadas imunomoduladoras.",
  },
  "Nevo melanocítico": {
    sintomas:
      "Mancha pigmentada simétrica, cor uniforme castanha clara ou preta, contornos redondos bem definidos.",
    acao: "Nenhuma ação corretiva urgente é necessária. Pratique a auto-inspeção dermatológica mensal de rotina.",
    detalhe:
      "Pinta benigna extremamente comum formada por ninhos aglomerados de melanócitos. Na ampla maioria, mantêm características estáveis pela vida toda. Mudanças morfológicas repentinas demandam atenção clínica.",
  },
  "Ceratose benigna": {
    sintomas:
      "Lesão verrucosa ceratótica marrom ou amarelada com aspecto ceroso de 'moeda colada' na pele.",
    acao: "Tratamento desnecessário, exceto por razões estéticas ou coceira recorrente devido a atrito mecânico.",
    detalhe:
      "Também conhecida como ceratose seborreica. É uma proliferação benigna epidérmica que surge em pessoas mais velhas. Não possui qualquer relação direta ou risco de malignidade futura.",
  },
  Dermatofibroma: {
    sintomas:
      "Nódulo pequeno firme avermelhado ou acastanhado nos membros inferiores que afunda ao apertar os lados.",
    acao: "Lesão tipicamente assintomática e benigna. Acompanhe as características visuais por precaução ordinária.",
    detalhe:
      "Nódulo benigno dérmico que comumente resulta de pequenas reações locais a picadas de insetos ou microtraumas subcutâneos superficiais. Não requer intervenção.",
  },
  "Lesão vascular": {
    sintomas:
      "Pequena pinta vermelha rubi brilhante ou manchas violáceas (hemangiomas, telangiectasias).",
    acao: "Benigno por natureza. Intervenções clínicas são focadas apenas em melhora estética se desejado.",
    detalhe:
      "Anomalias congênitas ou adquiridas decorrentes de dilatações de capilares sanguíneos da derme. Muito frequentes e completamente desprovidas de caráter carcinogênico.",
  },
};

export const TelaResultado: React.FC<TelaResultadoProps> = ({
  predicao,
  imagemUri,
  onNovaAnalise,
  onSalvarNoHistorico,
  salvo,
}) => {
  const [detalhesExpandido, setDetalhesExpandido] = useState(false);

  // Fallback to average generic details if unknown class
  const detalhesClasse = DESCRICOES_CLASSES[predicao.classePrevista] || {
    sintomas: "Lesão dermatológica registrada.",
    acao: "Consulte um especialista clínico para dirimir dúvidas.",
    detalhe: "Sem descrição específica.",
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-gray-800 p-5 overflow-y-auto space-y-4 font-sans pb-20 select-none">
      {/* Title */}
      <div>
        <h4 className="text-xs text-teal-600 font-bold uppercase tracking-wider">
          Resultado da IA
        </h4>
        <h2 className="text-xl font-bold text-gray-900 mt-1">
          Classificação Gerada
        </h2>
      </div>

      {/* Primary Result Details Card */}
      <CartaoResultado predicao={predicao} />

      {/* Selected Image Thumbnail preview */}
      <div className="flex gap-3 bg-white p-3 border border-gray-100 rounded-xl items-center">
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-150 shrink-0">
          <img
            src={imagemUri}
            alt="Thumbnail de análise"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-mono block uppercase">
            Análise de registro
          </span>
          <span className="text-xs font-bold text-gray-800 leading-snug truncate block max-w-47.5">
            {predicao.classePrevista}
          </span>
          <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-gray-600 mt-0.5 inline-block font-mono">
            {predicao.dataAnalise || "Visualizado agora"}
          </span>
        </div>
      </div>

      {/* Toggleable Expandable Details Module */}
      <div className="border border-gray-150 bg-white rounded-xl overflow-hidden shadow-xs">
        <button
          onClick={() => setDetalhesExpandido(!detalhesExpandido)}
          className="w-full p-3.5 flex justify-between items-center bg-gray-50 hover:bg-gray-100/70 border-b border-gray-150 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide">
            <Info className="w-4 h-4 text-teal-600" />
            <span>Ver detalhes do resultado</span>
          </div>
          {detalhesExpandido ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {detalhesExpandido && (
          <div className="p-4 space-y-3.5 text-xs text-gray-600 leading-relaxed border-t border-transparent animate-fadeIn">
            <div>
              <strong className="text-gray-950 text-xs block mb-1">
                Fatores morfológicos estimados:
              </strong>
              <p>{detalhesClasse.sintomas}</p>
            </div>

            <div className="p-3.5 bg-teal-50/40 rounded-xl border border-teal-100/50">
              <strong className="text-teal-900 text-xs block mb-1">
                Conduta recomendada:
              </strong>
              <p className="text-teal-950 font-medium">{detalhesClasse.acao}</p>
            </div>

            <div>
              <strong className="text-gray-950 text-xs block mb-1">
                Informações acadêmicas gerais:
              </strong>
              <p>{detalhesClasse.detalhe}</p>
            </div>
          </div>
        )}
      </div>

      {/* Other Class Sorted Probability distribution bars */}
      <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xs">
        <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-3.5">
          Distribuição Completa de Sinais
        </h4>
        <div className="space-y-4">
          {predicao.probabilidades.map((prob, index) => (
            <BarraProbabilidade
              key={index}
              classe={prob.classe}
              probabilidade={prob.probabilidade}
              destacar={prob.classe === predicao.classePrevista}
            />
          ))}
        </div>
      </div>

      {/* Prominent Safety disclaimer card */}
      <CartaoAvisoMedico />

      {/* Action CTA Buttons */}
      <div className="flex flex-col gap-2 pt-2">
        <BotaoPrincipal
          titulo={salvo ? "Salvo no histórico" : "Salvar no histórico"}
          onClick={onSalvarNoHistorico}
          desativado={salvo}
          icone={
            salvo ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />
          }
          variante="success"
        />

        <button
          onClick={onNovaAnalise}
          className="w-full py-3 px-4 text-center font-bold text-xs text-teal-700 hover:text-teal-850 bg-teal-50 rounded-xl hover:bg-teal-100/80 transition-all flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Fazer nova análise
        </button>
      </div>
    </div>
  );
};
