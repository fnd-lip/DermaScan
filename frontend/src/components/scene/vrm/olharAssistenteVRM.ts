import { VRMHumanBoneName } from "@pixiv/three-vrm";
import {
  POSE_BASE_ASSISTENTE,
  obterValorRotacaoBase,
  type PoseAssistente,
} from "./posesAssistenteVRM";

/*
  Movimento de olhar.
 
 A assistente já olha para o painel pela pose base.
 Aqui adicionamos microvariações para parecer viva.
 */
export function calcularOlharAssistente(tempo: number): PoseAssistente {
  const olharHorizontal = Math.sin(tempo * 0.85) * 0.025;
  const olharVertical = Math.sin(tempo * 0.65) * 0.018;

  return {
    [VRMHumanBoneName.Head]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.Head],
      x:
        obterValorRotacaoBase(VRMHumanBoneName.Head, "x") +
        olharVertical,
      y:
        obterValorRotacaoBase(VRMHumanBoneName.Head, "y") +
        olharHorizontal,
    },

    [VRMHumanBoneName.Neck]: {
      ...POSE_BASE_ASSISTENTE[VRMHumanBoneName.Neck],
      y:
        obterValorRotacaoBase(VRMHumanBoneName.Neck, "y") +
        olharHorizontal * 0.35,
    },
  };
}