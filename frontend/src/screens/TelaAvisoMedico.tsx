import React, { useState } from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import { BotaoPrincipal } from '../components/ui/BotaoPrincipal';

interface TelaAvisoMedicoProps {
  onAceitarAviso: () => void;
}

export const TelaAvisoMedico: React.FC<TelaAvisoMedicoProps> = ({ onAceitarAviso }) => {
  const [concordado, setConcordado] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white text-gray-800 p-6 justify-between select-none font-sans overflow-hidden">
      <div>
        <div className="flex items-center gap-2.5 my-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">
              Aviso Médico Obrigatório
            </h2>
            <p className="text-[10px] text-gray-500 font-medium">Fins Educacionais e Estatísticos</p>
          </div>
        </div>

        <div className="mt-4 border border-gray-100 rounded-2xl bg-slate-50 p-4 max-h-75 overflow-y-auto space-y-3.5 shadow-inner">
          <p className="text-xs font-semibold text-gray-800 leading-relaxed">
            Por favor, leia atentamente as declarações abaixo antes de utilizar a inteligência artificial do aplicativo:
          </p>

          <div className="space-y-3 text-xs leading-relaxed text-gray-600">
            <div className="p-2.5 bg-white rounded-lg border border-gray-200">
              <strong className="text-gray-900 block mb-1 font-bold">1. Não é um diagnóstico</strong>
              Este aplicativo utiliza um algoritmo computacional treinado por Deep Learning para analisar imagens de lesões de pele. <strong>Ele não realiza diagnósticos médicos e não detecta doenças de forma definitiva.</strong>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-gray-200">
              <strong className="text-gray-900 block mb-1 font-bold">2. Classificação Estatística</strong>
              As respostas mostradas indicam qual a maior probabilidade estatística de analogia visual conforme dados de treino. O resultado é meramente educacional e preliminar.
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-gray-200">
              <strong className="text-gray-900 block mb-1 font-bold">3. Sinais de Alerta Críticos</strong>
              Recomenda-se procurar assistência clínica imediatamente se notar os seguintes sintomas na lesão dermatológica:
              <ul className="list-disc pl-4 mt-2 space-y-1 text-gray-700">
                <li>Crescimento rápido ou expansão do tamanho</li>
                <li>Mudanças de cor ou múltiplos matizes</li>
                <li>Sangramento espontâneo ou coceira frequente</li>
                <li>Bordas assimétricas ou mal delimitadas</li>
                <li>Dor local ou inflamação ao redor</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4">
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors border border-transparent hover:border-teal-50">
          <input
            type="checkbox"
            checked={concordado}
            onChange={(e) => setConcordado(e.target.checked)}
            className="w-5 h-5 text-teal-600 bg-gray-150 border-gray-300 rounded focus:ring-teal-500 focus:ring-2 mt-0.5"
          />
          <span className="text-xs font-medium text-gray-700 leading-snug">
            Li e compreendi que este aplicativo não substitui avaliação médica profissional.
          </span>
        </label>

        <BotaoPrincipal
          titulo="Concordo e continuar"
          desativado={!concordado}
          onClick={onAceitarAviso}
          icone={<CheckCircle className="w-4 h-4" />}
          variante="primary"
        />
      </div>
    </div>
  );
};



