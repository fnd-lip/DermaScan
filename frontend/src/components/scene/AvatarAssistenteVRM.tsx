import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, type VRM } from "@pixiv/three-vrm";
import type { Group as ThreeGroup } from "three";
import {
  prepararAssistenteDermascan,
  type ControladorAssistenteVRM,
} from "./vrm/acoesAssistenteVRM";

interface AvatarAssistenteVRMProps {
  caminhoModelo: string;
}

type StatusModelo = "verificando" | "indisponivel" | "disponivel";

/*
  Ajustes principais do avatar.

  x negativo = esquerda
  x positivo = direita
  y negativo = baixo
  y positivo = cima
  z negativo = fundo
  z positivo = frente
*/
const POSICAO_AVATAR: [number, number, number] = [-1.62, -1.18, 0];

const ESCALA_AVATAR: [number, number, number] = [1.4, 1.4, 1.4];

/*
  Inversão para ela virar para o painel.
*/
const ROTACAO_BASE_AVATAR = Math.PI + 0.55;

const INTENSIDADE_FLUTUACAO = 0.035;
const INTENSIDADE_ROTACAO = 0.08;

/*
  Movimento horizontal.
*/
const INTENSIDADE_MOVIMENTO_LATERAL = 0.16;

export const AvatarAssistenteVRM: React.FC<AvatarAssistenteVRMProps> = ({
  caminhoModelo,
}) => {
  const [statusModelo, setStatusModelo] =
    useState<StatusModelo>("verificando");

  useEffect(() => {
    let componenteAtivo = true;

    async function verificarModelo() {
      try {
        const resposta = await fetch(caminhoModelo, {
          method: "HEAD",
          cache: "no-store",
        });

        if (!componenteAtivo) return;

        const tamanhoArquivo = Number(
          resposta.headers.get("content-length") ?? "0",
        );

        const modeloExisteEnaoEstaVazio =
          resposta.ok && tamanhoArquivo > 1024;

        setStatusModelo(
          modeloExisteEnaoEstaVazio ? "disponivel" : "indisponivel",
        );
      } catch {
        if (!componenteAtivo) return;

        setStatusModelo("indisponivel");
      }
    }

    void verificarModelo();

    return () => {
      componenteAtivo = false;
    };
  }, [caminhoModelo]);

  if (statusModelo !== "disponivel") {
    return null;
  }

  /*
    O key força o React a recriar o componente quando o modelo mudar
  */
  return (
    <ModeloVRMSeguro
      key={caminhoModelo}
      caminhoModelo={caminhoModelo}
    />
  );
};

interface ModeloVRMProps {
  caminhoModelo: string;
}

function ModeloVRMSeguro({ caminhoModelo }: ModeloVRMProps) {
  const grupoRef = useRef<ThreeGroup>(null);
  const controladorAssistenteRef =
    useRef<ControladorAssistenteVRM | null>(null);

  const [vrm, setVrm] = useState<VRM | null>(null);
  const [falhouAoCarregar, setFalhouAoCarregar] = useState(false);

  useEffect(() => {
    let componenteAtivo = true;

    controladorAssistenteRef.current = null;

    const loader = new GLTFLoader();

    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      caminhoModelo,
      (gltf) => {
        if (!componenteAtivo) return;

        const modeloVrm = (gltf as unknown as { userData: { vrm?: VRM } })
          .userData.vrm;

        if (!modeloVrm) {
          setFalhouAoCarregar(true);
          return;
        }

        modeloVrm.scene.traverse((objeto) => {
          objeto.frustumCulled = false;
        });

        controladorAssistenteRef.current =
          prepararAssistenteDermascan(modeloVrm);

        setVrm(modeloVrm);
      },
      undefined,
      () => {
        if (!componenteAtivo) return;

        setFalhouAoCarregar(true);
      },
    );

    return () => {
      componenteAtivo = false;
      controladorAssistenteRef.current = null;
    };
  }, [caminhoModelo]);

  useFrame((estado, delta) => {
    if (!vrm || !grupoRef.current) return;

    vrm.update(delta);

    const tempo = estado.clock.elapsedTime;

    controladorAssistenteRef.current?.atualizar(tempo);

    const movimentoVertical =
      Math.sin(tempo * 1.45) * INTENSIDADE_FLUTUACAO;

    const movimentoRotacao =
      Math.sin(tempo * 0.9) * INTENSIDADE_ROTACAO;

    const movimentoLateral =
      Math.sin(tempo * 0.75) * INTENSIDADE_MOVIMENTO_LATERAL;

    grupoRef.current.position.set(
      POSICAO_AVATAR[0] + movimentoLateral,
      POSICAO_AVATAR[1] + movimentoVertical,
      POSICAO_AVATAR[2],
    );

    grupoRef.current.rotation.y = ROTACAO_BASE_AVATAR + movimentoRotacao;
  });

  if (falhouAoCarregar || !vrm) {
    return null;
  }

  return (
    <group
      ref={grupoRef}
      position={POSICAO_AVATAR}
      rotation={[0, ROTACAO_BASE_AVATAR, 0]}
      scale={ESCALA_AVATAR}
    >
      <primitive object={vrm.scene} />
    </group>
  );
}