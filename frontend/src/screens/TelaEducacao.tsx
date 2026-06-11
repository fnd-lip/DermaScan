import React, { useState } from 'react';
import { BookOpen, Sun, AlertTriangle, ChevronDown, ChevronUp, Stethoscope } from 'lucide-react';

interface ArtigoEducativo {
  id: string;
  classeIcone: React.ReactNode;
  titulo: string;
  sumario: string;
  conteudoFull: React.ReactNode;
}

export const TelaEducacao: React.FC = () => {
  const [artigoAberto, setArtigoAberto] = useState<string | null>("abcde");

  const artigos: ArtigoEducativo[] = [
    {
      id: "abcde",
      classeIcone: <BookOpen className="w-5 h-5 text-teal-600" />,
      titulo: "Regra ABCDE de Sinais de Pele",
      sumario: "Aprenda a detectar os principais indícios visuais de malignidade em pintas de pele comuns.",
      conteudoFull: (
        <div className="space-y-4 text-xs text-gray-750">
          <p className="font-semibold text-gray-900">
            A regra ABCDE é um método mundialmente consagrado pelos dermatologistas para identificar sinais suspeitos de melanoma (câncer de pele agressivo):
          </p>

          <div className="grid grid-cols-5 border border-teal-100 rounded-xl overflow-hidden text-center divide-x divide-teal-50">
            <div className="bg-teal-50/40 p-2">
              <span className="text-sm font-extrabold text-teal-800 block">A</span>
              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">Assimetria</span>
            </div>
            <div className="bg-teal-50/40 p-2">
              <span className="text-sm font-extrabold text-teal-800 block">B</span>
              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">Bordas</span>
            </div>
            <div className="bg-teal-50/40 p-2">
              <span className="text-sm font-extrabold text-teal-800 block">C</span>
              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">Cor</span>
            </div>
            <div className="bg-teal-50/40 p-2">
              <span className="text-sm font-extrabold text-teal-800 block">D</span>
              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">Diâmetro</span>
            </div>
            <div className="bg-teal-50/40 p-2">
              <span className="text-sm font-extrabold text-teal-800 block">E</span>
              <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tight">Evolução</span>
            </div>
          </div>

          <div className="space-y-3 mt-3">
            <div className="pl-3.5 border-l-3 border-teal-500">
              <strong className="text-gray-900 text-xs font-bold block">A — Assimetria:</strong>
              <p className="mt-0.5 leading-relaxed text-gray-600">
                Se traçarmos uma linha imaginária dividindo a pinta ao meio, as duas metades são diferentes. Pintas benignas costumam ser perfeitamente redondas e simétricas.
              </p>
            </div>

            <div className="pl-3.5 border-l-3 border-teal-500">
              <strong className="text-gray-900 text-xs font-bold block">B — Bordas Regulares vs. Irregulares:</strong>
              <p className="mt-0.5 leading-relaxed text-gray-600">
                As bordas da lesão são denteadas, onduladas, ramificadas ou mal delimitadas. Sinais normais possuem contornos lisos e claros.
              </p>
            </div>

            <div className="pl-3.5 border-l-3 border-teal-500">
              <strong className="text-gray-900 text-xs font-bold block">C — Variação de Cor:</strong>
              <p className="mt-0.5 leading-relaxed text-gray-600">
                A presença de múltiplas cores (preto, castanho, cinza, azul, branco ou vermelho) em uma mesma mancha é um forte sinal de alerta. Lesões normais têm cor uniforme.
              </p>
            </div>

            <div className="pl-3.5 border-l-3 border-teal-500">
              <strong className="text-gray-900 text-xs font-bold block">D — Diâmetro Avançado:</strong>
              <p className="mt-0.5 leading-relaxed text-gray-600">
                O tamanho da lesão é maior do que 6 milímetros (aproximadamente a borracha na ponta de um lápis comum). Embora alguns melanomas surjam menores, este limiar exige atenção.
              </p>
            </div>

            <div className="pl-3.5 border-l-3 border-teal-500">
              <strong className="text-gray-900 text-xs font-bold block">E — Evolução Rápida:</strong>
              <p className="mt-0.5 leading-relaxed text-gray-600">
                Qualquer modificação no tamanho, espessura, cor, surgimento de coceira, ferida ou sangramento ao longo de semanas ou meses. É o critério clínico mais alarmante de todos.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "dermatologia",
      classeIcone: <Stethoscope className="w-5 h-5 text-indigo-600" />,
      titulo: "O que são lesões dermatológicas?",
      sumario: "Compreenda a definição básica de manchas, pintas e anomalias celulares cutâneas.",
      conteudoFull: (
        <div className="space-y-2.5 text-xs inline-block text-gray-600 leading-relaxed">
          <p>
            Uma lesão dermatológica é qualquer alteração na integridade ou aparência na superfície da pele. Elas podem ser classificadas fundamentalmente entre:
          </p>
          <ul className="list-disc pl-4 space-y-1 my-2">
            <li><strong>Benignas:</strong> Como nevos (pintas comuns), dermatofibromas e ceratoses benignas. Não oferecem riscos de espalhamento sistêmico.</li>
            <li><strong>Sintomáticas / Malignas:</strong> Como melanomas ou carcinomas que necessitam excisão cirúrgica definitiva para preservar a vida e saúde.</li>
          </ul>
          <p>
            A pele é o maior órgão do nosso corpo e reflete diretamente processos biológicos internos. Recomenda-se realizar uma inspeção anual integral com seu médico especializado.
          </p>
        </div>
      )
    },
    {
      id: "sol",
      classeIcone: <Sun className="w-5 h-5 text-amber-500" />,
      titulo: "Prevenção e Cuidados de Exposição Solar",
      sumario: "Diretrizes práticas de prevenção contra danos ultravioletas UVA e UVB cumulativos na pele.",
      conteudoFull: (
        <div className="space-y-2.5 text-xs text-gray-600 leading-relaxed">
          <p>
            A radiação ultravioleta emitida pelo sol é o fator ambiental de maior indução de mutações cancerígenas em células sebáceas e epidérmicas. Adote hábitos constantes de preservação:
          </p>
          <ul className="list-decimal pl-4.5 space-y-1">
            <li><strong>Filtro Solar Diário:</strong> Utilize fotoprotetores com Fator de Proteção Solar (FPS) de pelo menos 30 diariamente, mesmo sob céu nublado.</li>
            <li><strong>Evite Pico do Meio-Dia:</strong> Reduza exposição solar direta das 10h às 16h, intervalo de maior radiação incidente de raios UVB.</li>
            <li><strong>Vestimentas de Proteção:</strong> Chapéus de abas largas, óculos de sol com proteção UV certificada e roupas que cubram braços e pernas.</li>
          </ul>
        </div>
      )
    },
    {
      id: "limitacoes",
      classeIcone: <AlertTriangle className="w-5 h-5 text-red-500" />,
      titulo: "Limitações da Inteligência Artificial em Saúde",
      sumario: "Importância de entender o escopo complementar das estimativas de redes neurais na medicina.",
      conteudoFull: (
        <div className="space-y-2.5 text-xs text-gray-600 leading-relaxed">
          <p>
            Embora o processamento digital de imagens por algoritmos convolucionais profundos (Deep Learning) atinja acurácias estatísticas surpreendentes em datasets de laboratório, existem limites intrínsecos severos:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Limitações Estéticas:</strong> Iluminação inadequada, foco trêmulo, quantidade de pelos adjacentes e pele umedecida reduzem drasticamente as métricas de confiança da rede.</li>
            <li><strong>Interpretação Holística:</strong> A IA analisa apenas a mancha isoladamente, enquanto uma consulta médica presencial avalia o histórico familiar, fatores predisponentes, anatomia linfática e exames complementares como dermatoscopia digital profunda.</li>
            <li><strong>Isenção de Laudo:</strong> O algoritmo fornece apenas classificações de proximidade visual e nunca gera laudos ou diagnósticos médicos legítimos.</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 text-gray-800 p-5 overflow-y-auto font-sans pb-20 select-none">
      
      {/* Header */}
      <div>
        <h4 className="text-xs text-teal-600 font-bold uppercase tracking-wider">Aprender</h4>
        <h2 className="text-xl font-bold text-gray-900 mt-1">Guia Educativo</h2>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
          Conhecimento preventivo e terminologias dermatológicas.
        </p>
      </div>

      {/* Artigos Accordion lists */}
      <div className="space-y-3.5 mt-4">
        {artigos.map((item) => {
          const aberto = artigoAberto === item.id;
          return (
            <div
              key={item.id}
              className="bg-white border border-gray-150 rounded-2xl overflow-hidden transition-all duration-200 shadow-sm"
            >
              <button
                onClick={() => setArtigoAberto(aberto ? null : item.id)}
                className="w-full p-4 flex items-start gap-3.5 text-left bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="w-9 h-9 bg-slate-50 border border-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  {item.classeIcone}
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-xs.1 font-bold text-gray-900 leading-tight">
                    {item.titulo}
                  </h3>
                  {!aberto && (
                    <p className="text-[11px] text-gray-400 truncate mt-1 leading-normal">
                      {item.sumario}
                    </p>
                  )}
                </div>
                <div className="shrink-0 mt-2 text-gray-400">
                  {aberto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {aberto && (
                <div className="px-4.5 pb-4.5 pt-1 text-xs text-gray-700 leading-relaxed border-t border-gray-50 bg-white select-text animate-fadeIn">
                  {item.conteudoFull}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};



