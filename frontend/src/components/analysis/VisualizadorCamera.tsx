import React from "react";

interface VisualizadorCameraProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onCancelar: () => void;
  onCapturar: () => void;
}

export const VisualizadorCamera: React.FC<VisualizadorCameraProps> = ({
  videoRef,
  onCancelar,
  onCapturar,
}) => {
  return (
    <div className="absolute inset-x-0 top-0 bottom-15 bg-black z-50 flex flex-col justify-between">
      <div className="p-4 flex justify-between items-center text-white bg-slate-950/80">
        <h3 className="text-xs font-bold uppercase tracking-widest text-teal-300">
          Câmera Ativa — DermaScan
        </h3>

        <button
          type="button"
          onClick={onCancelar}
          className="text-xs text-gray-400 hover:text-white bg-white/15 px-3 py-1 rounded-md"
        >
          Cancelar
        </button>
      </div>

      <div className="relative aspect-square w-full max-w-sm mx-auto bg-slate-900 border-y border-teal-500/30 overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          aria-label="Visualização ao vivo da câmera"
          className="w-full h-full object-cover scale-x-[-1]"
        >
          <track
            kind="captions"
            src="/captions/camera-preview.vtt"
            srcLang="pt-BR"
            label="Português"
            default
          />
        </video>

        <div className="absolute inset-10 border border-teal-400/50 rounded-2xl pointer-events-none flex items-center justify-center">
          <span className="text-[10px] text-teal-300 bg-slate-950/85 px-2 py-0.5 rounded font-mono tracking-wider">
            Mantenha a lesão no centro
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col items-center justify-center bg-slate-950 text-white gap-2">
        <button
          type="button"
          aria-label="Capturar imagem para análise"
          title="Capturar imagem"
          onClick={onCapturar}
          className="w-16 h-16 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl transition-all"
        />

        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono mt-1">
          Toque para analisar
        </span>
      </div>
    </div>
  );
};
