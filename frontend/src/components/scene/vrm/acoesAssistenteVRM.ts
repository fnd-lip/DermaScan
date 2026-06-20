import { VRMHumanBoneName, type VRM } from "@pixiv/three-vrm";
import type { Object3D } from "three";
import { calcularAnimacaoAssistente } from "./animacoesAssistenteVRM";
import { calcularOlharAssistente } from "./olharAssistenteVRM";
import {
  OSSOS_ASSISTENTE_USADOS,
  POSE_BASE_ASSISTENTE,
  type PoseAssistente,
  type RotacaoOsso,
} from "./posesAssistenteVRM";

type OssosAssistente = Partial<Record<VRMHumanBoneName, Object3D | null>>;

export interface ControladorAssistenteVRM {
  atualizar: (tempo: number) => void;
}

/*
 Quanto menor, mais suave.
 Quanto maior, mais responsivo.
 */
const SUAVIZACAO_ANIMACAO = 0.16;

/*
 Prepara a assistente VRM 
 */
export function prepararAssistenteDermascan(
  vrm: VRM,
): ControladorAssistenteVRM {
  const ossos = obterOssosAssistente(vrm);

  aplicarPose(ossos, POSE_BASE_ASSISTENTE, 1);

  return {
    atualizar: (tempo: number) => {
      const animacao = calcularAnimacaoAssistente(tempo);
      const olhar = calcularOlharAssistente(tempo);

      const poseFinal = combinarPoses(POSE_BASE_ASSISTENTE, animacao, olhar);

      aplicarPose(ossos, poseFinal, SUAVIZACAO_ANIMACAO);
    },
  };
}

function obterOssosAssistente(vrm: VRM): OssosAssistente {
  const ossos: OssosAssistente = {};

  for (const nomeOsso of OSSOS_ASSISTENTE_USADOS) {
    ossos[nomeOsso] = obterOsso(vrm, nomeOsso);
  }

  return ossos;
}

function aplicarPose(
  ossos: OssosAssistente,
  pose: PoseAssistente,
  intensidade: number,
) {
  for (const [nomeOsso, rotacao] of Object.entries(pose)) {
    const osso = ossos[nomeOsso as VRMHumanBoneName];

    if (!osso || !rotacao) continue;

    if (rotacao.x !== undefined) {
      osso.rotation.x = interpolar(osso.rotation.x, rotacao.x, intensidade);
    }

    if (rotacao.y !== undefined) {
      osso.rotation.y = interpolar(osso.rotation.y, rotacao.y, intensidade);
    }

    if (rotacao.z !== undefined) {
      osso.rotation.z = interpolar(osso.rotation.z, rotacao.z, intensidade);
    }
  }
}

function combinarPoses(...poses: PoseAssistente[]): PoseAssistente {
  const poseCombinada: PoseAssistente = {};

  for (const pose of poses) {
    for (const [nomeOsso, rotacao] of Object.entries(pose)) {
      const osso = nomeOsso as VRMHumanBoneName;

      poseCombinada[osso] = {
        ...(poseCombinada[osso] ?? {}),
        ...(rotacao as RotacaoOsso),
      };
    }
  }

  return poseCombinada;
}

function interpolar(
  valorAtual: number,
  valorAlvo: number,
  intensidade: number,
) {
  return valorAtual + (valorAlvo - valorAtual) * intensidade;
}

function obterOsso(vrm: VRM, nomeOsso: VRMHumanBoneName): Object3D | null {
  const humanoid = vrm.humanoid as unknown as {
    getNormalizedBoneNode?: (nome: VRMHumanBoneName) => Object3D | null;
    getRawBoneNode?: (nome: VRMHumanBoneName) => Object3D | null;
  };

  return (
    humanoid.getNormalizedBoneNode?.(nomeOsso) ??
    humanoid.getRawBoneNode?.(nomeOsso) ??
    null
  );
}
