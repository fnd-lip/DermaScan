import { VRMHumanBoneName } from "@pixiv/three-vrm";

export type RotacaoOsso = {
  x?: number;
  y?: number;
  z?: number;
};

export type PoseAssistente = Partial<Record<VRMHumanBoneName, RotacaoOsso>>;

/*
 Pose base da assistente DermaScan.
 
 Aqui ficam as posições neutras:
  - braços baixos
  - cabeça voltada para o painel
  - corpo levemente orientado para a classificação
 */
export const POSE_BASE_ASSISTENTE: PoseAssistente = {
  [VRMHumanBoneName.Hips]: {
    x: 0,
    y: 0,
    z: 0,
  },

  [VRMHumanBoneName.Spine]: {
    x: 0,
    y: 0.05,
    z: 0,
  },

  [VRMHumanBoneName.Chest]: {
    x: 0,
    y: 0.08,
    z: 0,
  },

  [VRMHumanBoneName.Neck]: {
    x: 0,
    y: 0.16,
    z: 0,
  },

  [VRMHumanBoneName.Head]: {
    x: -0.04,
    y: 0.42,
    z: 0,
  },

  [VRMHumanBoneName.LeftShoulder]: {
    x: 0,
    y: 0,
    z: 0.08,
  },

  [VRMHumanBoneName.RightShoulder]: {
    x: 0,
    y: 0,
    z: -0.08,
  },

  /*
   Braços baixos
   */
  [VRMHumanBoneName.LeftUpperArm]: {
    x: -0.02,
    y: 0.02,
    z: 1.25,
  },

  [VRMHumanBoneName.LeftLowerArm]: {
    x: -0.18,
    y: 0,
    z: 0.08,
  },

  [VRMHumanBoneName.LeftHand]: {
    x: 0,
    y: 0,
    z: 0,
  },

  [VRMHumanBoneName.RightUpperArm]: {
    x: -0.02,
    y: -0.02,
    z: -1.25,
  },

  [VRMHumanBoneName.RightLowerArm]: {
    x: -0.18,
    y: 0,
    z: -0.08,
  },

  [VRMHumanBoneName.RightHand]: {
    x: 0,
    y: 0,
    z: 0,
  },

  [VRMHumanBoneName.LeftUpperLeg]: {
    x: 0.03,
  },

  [VRMHumanBoneName.LeftLowerLeg]: {
    x: 0.04,
  },

  [VRMHumanBoneName.LeftFoot]: {
    x: 0,
  },

  [VRMHumanBoneName.RightUpperLeg]: {
    x: -0.03,
  },

  [VRMHumanBoneName.RightLowerLeg]: {
    x: 0.04,
  },

  [VRMHumanBoneName.RightFoot]: {
    x: 0,
  },
};

export const OSSOS_ASSISTENTE_USADOS: VRMHumanBoneName[] = [
  VRMHumanBoneName.Hips,
  VRMHumanBoneName.Spine,
  VRMHumanBoneName.Chest,
  VRMHumanBoneName.Neck,
  VRMHumanBoneName.Head,

  VRMHumanBoneName.LeftShoulder,
  VRMHumanBoneName.LeftUpperArm,
  VRMHumanBoneName.LeftLowerArm,
  VRMHumanBoneName.LeftHand,

  VRMHumanBoneName.RightShoulder,
  VRMHumanBoneName.RightUpperArm,
  VRMHumanBoneName.RightLowerArm,
  VRMHumanBoneName.RightHand,

  VRMHumanBoneName.LeftUpperLeg,
  VRMHumanBoneName.LeftLowerLeg,
  VRMHumanBoneName.LeftFoot,

  VRMHumanBoneName.RightUpperLeg,
  VRMHumanBoneName.RightLowerLeg,
  VRMHumanBoneName.RightFoot,
];

export function obterValorRotacaoBase(
  nomeOsso: VRMHumanBoneName,
  eixo: keyof RotacaoOsso,
): number {
  return POSE_BASE_ASSISTENTE[nomeOsso]?.[eixo] ?? 0;
}