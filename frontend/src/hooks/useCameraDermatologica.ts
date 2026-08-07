import { type ChangeEvent, useEffect, useRef, useState } from "react";

interface UseCameraDermatologicaProps {
  onImagemSelecionada: (uri: string, sampleId?: string) => void;
}

export function useCameraDermatologica({
  onImagemSelecionada,
}: UseCameraDermatologicaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [usandoCameraReal, setUsandoCameraReal] = useState(false);
  const [erroCamera, setErroCamera] = useState<string | null>(null);

  /*
   * Este efeito é executado depois que o React renderiza o elemento
   * <video>. Nesse momento, videoRef.current já está disponível.
   */
  useEffect(() => {
    const video = videoRef.current;
    const mediaStream = streamRef.current;

    if (!usandoCameraReal || !video || !mediaStream) {
      return;
    }

    video.srcObject = mediaStream;

    const reproduzirVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.error("Erro ao reproduzir a câmera:", error);

        setErroCamera(
          "A câmera foi autorizada, mas não foi possível exibir a imagem.",
        );
      }
    };

    void reproduzirVideo();

    return () => {
      if (video.srcObject === mediaStream) {
        video.srcObject = null;
      }
    };
  }, [usandoCameraReal]);

  /*
   * Encerra a câmera caso o usuário saia da tela ou o componente
   * seja desmontado.
   */
  useEffect(() => {
    return () => {
      encerrarCamera(streamRef.current);
      streamRef.current = null;
    };
  }, []);

  const iniciarCameraReal = async () => {
    setErroCamera(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("A API de câmera não está disponível.");
      }

      encerrarCamera(streamRef.current);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
          width: {
            ideal: 640,
          },
          height: {
            ideal: 640,
          },
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setUsandoCameraReal(true);
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error);

      encerrarCamera(streamRef.current);
      streamRef.current = null;
      setUsandoCameraReal(false);

      setErroCamera(
        "Permissão de câmera negada ou câmera indisponível. Verifique as permissões do navegador.",
      );
    }
  };

  const capturarFoto = () => {
    const video = videoRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setErroCamera(
        "A imagem da câmera ainda não está pronta. Aguarde alguns segundos.",
      );

      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const contexto = canvas.getContext("2d");

    if (!contexto) {
      setErroCamera("Não foi possível processar a imagem capturada.");
      return;
    }

    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imagemCapturada = canvas.toDataURL("image/jpeg", 0.92);

    encerrarCamera(streamRef.current);
    streamRef.current = null;

    video.srcObject = null;

    setUsandoCameraReal(false);
    setErroCamera(null);

    onImagemSelecionada(imagemCapturada, "captured_photo");
  };

  const cancelarCamera = () => {
    encerrarCamera(streamRef.current);
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setUsandoCameraReal(false);
    setErroCamera(null);
  };

  const abrirGaleriaNativa = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (evento: ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) {
      return;
    }

    const leitor = new FileReader();

    leitor.onload = (resultado) => {
      const conteudo = resultado.target?.result;

      if (typeof conteudo === "string") {
        onImagemSelecionada(conteudo, "uploaded_file");
      }
    };

    leitor.readAsDataURL(arquivo);

    evento.target.value = "";
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

function encerrarCamera(mediaStream: MediaStream | null) {
  mediaStream?.getTracks().forEach((track) => track.stop());
}
