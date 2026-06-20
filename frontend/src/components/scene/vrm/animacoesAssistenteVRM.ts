import { VRMHumanBoneName } from "@pixiv/three-vrm";
import {
  POSE_BASE_ASSISTENTE,
  obterValorRotacaoBase,
  type PoseAssistente,
} from "./posesAssistenteVRM";

/*
  Ajustes de intensidade.
 */
const VELOCIDADE_PASSO = 2.6;
const AMPLITUDE_PASSO = 0.18;
const AMPLITUDE_JOELHO = 0.22;
const AMPLITUDE_BRACOS = 0.08;
const AMPLITUDE_QUADRIL = 0.035;
const AMPLITUDE_RESPIRACAO = 0.018;

/*
  Animações procedurais da assistente

  Inclui:
  - caminhada no lugar
  - balanço de quadril
  - braços acompanhando o passo
  - respiração
  - pequenos movimentos nas mãos
 */
export function calcularAnimacaoAssistente(tempo: number): PoseAssistente {
  const passo = Math.sin(tempo * VELOCIDADE_PASSO);
  const passoInvertido = Math.cos(tempo * VELOCIDADE_PASSO);

  const respiracao = Math.sin(tempo * 1.25) * AMPLITUDE_RESPIRACAO;
  const balancoQuadril = Math.sin(tempo * VELOCIDADE_PASSO) * AMPLITUDE_QUADRIL;
  const balancoTorso = Math.sin(tempo * VELOCIDADE_PASSO + Math.PI) * 0.025;

  const balancoBraco =
    Math.sin(tempo * VELOCIDADE_PASSO + Math.PI) * AMPLITUDE_BRACOS;
  const movimentoMao = Math.sin(tempo * 1.8) * 0.035;

  return {
    [VRMHumanBoneName.Hips]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.Hips],
      y: obterValorRotacaoBase(VRMHumanBoneName.Hips, "y") + balancoQuadril,
      z:
        obterValorRotacaoBase(VRMHumanBoneName.Hips, "z") +
        balancoQuadril * 0.45,
    },

    [VRMHumanBoneName.Spine]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.Spine],
      z: obterValorRotacaoBase(VRMHumanBoneName.Spine, "z") + balancoTorso,
    },

    [VRMHumanBoneName.Chest]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.Chest],
      z: obterValorRotacaoBase(VRMHumanBoneName.Chest, "z") + respiracao,
    },

    /*
     Ombros e braços acompanham a caminhada,
      mas continuam baixos pela pose base.
     */
    [VRMHumanBoneName.LeftShoulder]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.LeftShoulder],
      z:
        obterValorRotacaoBase(VRMHumanBoneName.LeftShoulder, "z") +
        balancoBraco * 0.12,
    },

    [VRMHumanBoneName.RightShoulder]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.RightShoulder],
      z:
        obterValorRotacaoBase(VRMHumanBoneName.RightShoulder, "z") -
        balancoBraco * 0.12,
    },

    [VRMHumanBoneName.LeftUpperArm]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.LeftUpperArm],
      x:
        obterValorRotacaoBase(VRMHumanBoneName.LeftUpperArm, "x") +
        balancoBraco,
      z:
        obterValorRotacaoBase(VRMHumanBoneName.LeftUpperArm, "z") +
        balancoBraco * 0.08,
    },

    [VRMHumanBoneName.LeftLowerArm]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.LeftLowerArm],
      x:
        obterValorRotacaoBase(VRMHumanBoneName.LeftLowerArm, "x") -
        Math.abs(balancoBraco) * 0.35,
    },

    [VRMHumanBoneName.LeftHand]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.LeftHand],
      z: obterValorRotacaoBase(VRMHumanBoneName.LeftHand, "z") + movimentoMao,
    },

    [VRMHumanBoneName.RightUpperArm]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.RightUpperArm],
      x:
        obterValorRotacaoBase(VRMHumanBoneName.RightUpperArm, "x") -
        balancoBraco,
      z:
        obterValorRotacaoBase(VRMHumanBoneName.RightUpperArm, "z") -
        balancoBraco * 0.08,
    },

    [VRMHumanBoneName.RightLowerArm]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.RightLowerArm],
      x:
        obterValorRotacaoBase(VRMHumanBoneName.RightLowerArm, "x") -
        Math.abs(balancoBraco) * 0.35,
    },

    [VRMHumanBoneName.RightHand]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.RightHand],
      z: obterValorRotacaoBase(VRMHumanBoneName.RightHand, "z") - movimentoMao,
    },

    /*
      Pernas simulando caminhada no lugar
     */
    [VRMHumanBoneName.LeftUpperLeg]: {
      x:
        obterValorRotacaoBase(VRMHumanBoneName.LeftUpperLeg, "x") +
        passo * AMPLITUDE_PASSO,
    },

    [VRMHumanBoneName.RightUpperLeg]: {
      x:
        obterValorRotacaoBase(VRMHumanBoneName.RightUpperLeg, "x") -
        passo * AMPLITUDE_PASSO,
    },

    [VRMHumanBoneName.LeftLowerLeg]: {
      x:
        obterValorRotacaoBase(VRMHumanBoneName.LeftLowerLeg, "x") +
        Math.max(0, -passoInvertido) * AMPLITUDE_JOELHO,
    },

    [VRMHumanBoneName.RightLowerLeg]: {
      x:
        obterValorRotacaoBase(VRMHumanBoneName.RightLowerLeg, "x") +
        Math.max(0, passoInvertido) * AMPLITUDE_JOELHO,
    },

    [VRMHumanBoneName.LeftFoot]: {
      x: obterValorRotacaoBase(VRMHumanBoneName.LeftFoot, "x") - passo * 0.045,
    },

    [VRMHumanBoneName.RightFoot]: {
      x: obterValorRotacaoBase(VRMHumanBoneName.RightFoot, "x") + passo * 0.045,
    },
  };
}
