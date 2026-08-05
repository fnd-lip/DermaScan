import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, type VRM } from "@pixiv/three-vrm";
import type { Group as ThreeGroup } from "three";
import {
  prepararAssistenteDermascan,
  type ControladorAssistenteVRM,
} from "./vrm/acoesAssistenteVRM";

type AvatarAssistenteVRMProps = Readonly<{
  caminhoModelo: string;
}>;

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

const ROTACAO_BASE_AVATAR = Math.PI + 0.55;

const INTENSIDADE_FLUTUACAO = 0.035;
const INTENSIDADE_ROTACAO = 0.08;
const INTENSIDADE_MOVIMENTO_LATERAL = 0.16;

export const AvatarAssistenteVRM: React.FC<AvatarAssistenteVRMProps> = ({
  caminhoModelo,
}) => {
  return <ModeloVRMSeguro key={caminhoModelo} caminhoModelo={caminhoModelo} />;
};

type ModeloVRMProps = Readonly<{
  caminhoModelo: string;
}>;

function ModeloVRMSeguro({ caminhoModelo }: ModeloVRMProps) {
  const grupoRef = useRef<ThreeGroup>(null);
  const controladorAssistenteRef = useRef<ControladorAssistenteVRM | null>(
    null,
  );

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
        if (!componenteAtivo) {
          return;
        }

        const modeloVrm = (gltf as unknown as { userData: { vrm?: VRM } })
          .userData.vrm;

        if (!modeloVrm) {
          console.warn("Arquivo carregado, mas nenhum VRM foi encontrado.");
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
      (erro) => {
        if (!componenteAtivo) {
          return;
        }

        console.warn("Falha ao carregar o modelo VRM:", caminhoModelo, erro);
        setFalhouAoCarregar(true);
      },
    );

    return () => {
      componenteAtivo = false;
      controladorAssistenteRef.current = null;
    };
  }, [caminhoModelo]);

  useFrame((estado, delta) => {
    if (!vrm || !grupoRef.current) {
      return;
    }

    vrm.update(delta);

    const tempo = estado.clock.elapsedTime;

    controladorAssistenteRef.current?.atualizar(tempo);

    const movimentoVertical = Math.sin(tempo * 1.45) * INTENSIDADE_FLUTUACAO;

    const movimentoRotacao = Math.sin(tempo * 0.9) * INTENSIDADE_ROTACAO;

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
