import type { ComponentType } from "react";
import {
  ConteudoAvisoMedico,
  ConteudoPermissoes,
  ConteudoPrivacidadeDados,
  ConteudoSobreAplicativo,
} from "../components/profile/ConteudosPerfil";

export type SecaoPerfilId =
  | "sobre"
  | "aviso_medico"
  | "privacidade"
  | "permissoes";

export type TipoIconeSecaoPerfil = "info" | "alerta" | "privacidade" | "camera";

export interface SecaoPerfil {
  readonly id: SecaoPerfilId;
  readonly titulo: string;
  readonly tipoIcone: TipoIconeSecaoPerfil;
  readonly Conteudo: ComponentType;
}

export const secoesPerfil: SecaoPerfil[] = [
  {
    id: "sobre",
    titulo: "Sobre o DermaScan",
    tipoIcone: "info",
    Conteudo: ConteudoSobreAplicativo,
  },
  {
    id: "aviso_medico",
    titulo: "Uso Clínico e Limitações",
    tipoIcone: "alerta",
    Conteudo: ConteudoAvisoMedico,
  },
  {
    id: "privacidade",
    titulo: "Privacidade de Dados",
    tipoIcone: "privacidade",
    Conteudo: ConteudoPrivacidadeDados,
  },
  {
    id: "permissoes",
    titulo: "Gerenciar Permissões",
    tipoIcone: "camera",
    Conteudo: ConteudoPermissoes,
  },
];
