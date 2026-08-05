import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Camera, Shield, Stethoscope } from "lucide-react";
import { BotaoPrincipal } from "../components/ui/BotaoPrincipal";

interface TelaDeApresentacaoProps {
  onFinalizarOnboarding: () => void;
}

export const TelaDeApresentacao: React.FC<TelaDeApresentacaoProps> = ({
  onFinalizarOnboarding,
}) => {
  const [slideAtual, setSlideAtual] = useState(0);

  const slides = [
    {
      titulo: "Captura de Imagem",
      descricao:
        "Tire uma foto ou envie uma imagem da galeria para iniciar a análise da lesão dermatológica.",
      detalhes:
        "O sistema aceita capturas em tempo real ou fotos antigas guardadas no seu rolo de câmera.",
      icone: <Camera className="w-10 h-10 text-teal-600" aria-hidden="true" />,
      tituloBotao: "Avançar",
    },
    {
      titulo: "Análise assistida por IA",
      descricao:
        "O aplicativo utiliza inteligência artificial para classificar imagens de pele com base em padrões visuais.",
      detalhes:
        "A inteligência artificial analisa características visuais da lesão para estimar uma possível classificação.",
      icone: <Shield className="w-10 h-10 text-teal-600" aria-hidden="true" />,
      tituloBotao: "Entendi",
    },
    {
      titulo: "Aviso Profissional",
      descricao:
        "Este aplicativo não substitui uma consulta médica. Em caso de dúvida, procure um dermatologista.",
      detalhes:
        "As classificações geradas por inteligência artificial são apenas estimativas estatísticas para apoiar o aprendizado acadêmico.",
      icone: (
        <Stethoscope className="w-10 h-10 text-teal-600" aria-hidden="true" />
      ),
      tituloBotao: "Começar",
    },
  ];

  const handleProximo = () => {
    if (slideAtual < slides.length - 1) {
      setSlideAtual(slideAtual + 1);
      return;
    }

    onFinalizarOnboarding();
  };

  const handleVoltar = () => {
    if (slideAtual > 0) {
      setSlideAtual(slideAtual - 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-gray-800 p-6 justify-between select-none">
      <div className="flex justify-between items-center h-8">
        {slideAtual > 0 ? (
          <button
            type="button"
            onClick={handleVoltar}
            className="text-gray-400 hover:text-gray-600 text-xs font-semibold"
          >
            Voltar
          </button>
        ) : (
          <div />
        )}

        {slideAtual < slides.length - 1 && (
          <button
            type="button"
            onClick={onFinalizarOnboarding}
            className="text-teal-600 hover:text-teal-700 text-xs font-semibold"
          >
            Pular Introdução
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center my-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideAtual}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center px-4"
          >
            <div className="w-20 h-20 bg-teal-50 border border-teal-100/50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              {slides[slideAtual].icone}
            </div>

            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {slides[slideAtual].titulo}
            </h2>

            <p className="mt-4 text-sm text-gray-600 leading-relaxed font-medium">
              {slides[slideAtual].descricao}
            </p>

            <p className="mt-3 text-xs text-gray-400 leading-relaxed">
              {slides[slideAtual].detalhes}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center gap-6 pb-4">
        <div className="flex gap-2.5" aria-label="Seleção de slide">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.titulo}
              onClick={() => setSlideAtual(index)}
              aria-label={`Ir para o slide ${index + 1}: ${slide.titulo}`}
              aria-current={index === slideAtual ? "step" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === slideAtual ? "w-6 bg-teal-600" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        <BotaoPrincipal
          titulo={slides[slideAtual].tituloBotao}
          onClick={handleProximo}
          className="w-full"
        />
      </div>
    </div>
  );
};
