import { ChangeEvent, useEffect, useRef, useState } from 'react';

interface UseCameraDermatologicaProps {
  onImagemSelecionada: (uri: string, sampleId?: string) => void;
}

export function useCameraDermatologica({ onImagemSelecionada }: UseCameraDermatologicaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [usandoCameraReal, setUsandoCameraReal] = useState(false);
  const [erroCamera, setErroCamera] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => encerrarCamera(stream);
  }, [stream]);

  const iniciarCameraReal = async () => {
    setErroCamera(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 640 },
        audio: false,
      });
      setUsandoCameraReal(true);
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (erro) {
      console.error('Camera access error:', erro);
      setErroCamera('Permissão de câmera negada ou indisponível. Ative a permissão de câmera nas configurações para capturar fotos.');
    }
  };

  const capturarFoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;

    const contexto = canvas.getContext('2d');
    if (!contexto) return;

    contexto.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    encerrarCamera(stream);
    setStream(null);
    setUsandoCameraReal(false);
    onImagemSelecionada(canvas.toDataURL('image/jpeg'), 'captured_photo');
  };

  const cancelarCamera = () => {
    encerrarCamera(stream);
    setStream(null);
    setUsandoCameraReal(false);
    setErroCamera(null);
  };

  const abrirGaleriaNativa = () => fileInputRef.current?.click();

  const handleFileChange = (evento: ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = (resultado) => {
      if (resultado.target?.result) {
        onImagemSelecionada(resultado.target.result as string, 'uploaded_file');
      }
    };
    leitor.readAsDataURL(arquivo);
  };

  return {
    videoRef,
    fileInputRef,
    usandoCameraReal,
    erroCamera,
    iniciarCameraReal,
    capturarFoto,
    cancelarCamera,
    abrirGaleriaNativa,
    handleFileChange,
  };
}

function encerrarCamera(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}



