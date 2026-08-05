import React from "react";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import { BotaoPrincipal } from "../components/ui/BotaoPrincipal";
import { CartaoImagem } from "../components/dermatology/CartaoImagem";

interface TelaConferirImagemProps {
  imagemUri: string;
  onVoltar: () => void;
  onConfirmar: () => void;
  isCustomPhoto?: boolean;
}

export const TelaConferirImagem: React.FC<TelaConferirImagemProps> = ({
  imagemUri,
  onVoltar,
  onConfirmar,
  isCustomPhoto = false,
}) => {
  return (
    <div className="flex flex-col h-full bg-white text-gray-800 p-5 justify-between font-sans overflow-y-auto select-none pb-8">
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <button
            type="button"
            onClick={onVoltar}
            aria-label="Voltar"
            className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          <h2 className="text-base font-bold text-gray-900 leading-tight">
            Ajuste de Alinhamento
          </h2>
        </div>

        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Verifique se a lesão está visível, centralizada e com boa iluminação.
          Nosso modelo irá extrair características morfológicas da área em
          destaque.
        </p>

        <div className="max-w-xs mx-auto">
          <CartaoImagem uri={imagemUri} mostrarGuia={true} />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 mt-5">
        <BotaoPrincipal
          titulo="Analisar com IA"
          onClick={onConfirmar}
          icone={<BrainCircuit className="w-5 h-5" aria-hidden="true" />}
          variante="primary"
        />

        <button
          type="button"
          onClick={onVoltar}
          className="text-xs text-teal-700 hover:text-teal-800 py-2.5 font-bold hover:underline transition-all text-center"
        >
          {isCustomPhoto
            ? "Refazer foto / Captura"
            : "Escolher outra imagem da galeria"}
        </button>
      </div>
    </div>
  );
};
