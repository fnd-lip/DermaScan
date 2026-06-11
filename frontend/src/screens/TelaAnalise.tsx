import React from 'react';
import { AlertaCamera } from '../components/analysis/AlertaCamera';
import { CartoesCaptura } from '../components/analysis/CartoesCaptura';
import { DicasAnalise } from '../components/analysis/DicasAnalise';
import { ListaAmostrasAcademicas } from '../components/analysis/ListaAmostrasAcademicas';
import { VisualizadorCamera } from '../components/analysis/VisualizadorCamera';
import { useCameraDermatologica } from '../hooks/useCameraDermatologica';

interface TelaAnaliseProps {
  onImagemSelecionada: (uri: string, sampleId?: string) => void;
}

export const TelaAnalise: React.FC<TelaAnaliseProps> = ({
  onImagemSelecionada,
}) => {
  const {
    usandoCameraReal,
    videoRef,
    cancelarCamera,
    capturarFoto,
    erroCamera,
    fileInputRef,
    handleFileChange,
    iniciarCameraReal,
    abrirGaleriaNativa,
  } = useCameraDermatologica({ onImagemSelecionada });

  return (
    <div className="flex flex-col h-full bg-slate-50 text-gray-800 p-5 overflow-y-auto space-y-4 font-sans pb-20 select-none">
      {usandoCameraReal && (
        <VisualizadorCamera
          videoRef={videoRef}
          onCancelar={cancelarCamera}
          onCapturar={capturarFoto}
        />
      )}

      <div>
        <h2 className="text-base font-bold text-gray-900 leading-tight">
          Nova análise dermatológica
        </h2>

        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Escolha uma opção para enviar a imagem da lesão que deseja analisar.
        </p>
      </div>

      <AlertaCamera mensagem={erroCamera} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <CartoesCaptura
        onAbrirCamera={iniciarCameraReal}
        onAbrirGaleria={abrirGaleriaNativa}
      />

      <ListaAmostrasAcademicas onSelecionarAmostra={onImagemSelecionada} />

      <DicasAnalise />
    </div>
  );
};