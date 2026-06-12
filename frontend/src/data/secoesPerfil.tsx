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

export type TipoIconeSecaoPerfil =
  | "info"
  | "alerta"
  | "privacidade"
  | "camera";

export interface SecaoPerfil {
  id: SecaoPerfilId;
  titulo: string;
  tipoIcone: TipoIconeSecaoPerfil;
  Conteudo: ComponentType;
}

export const secoesPerfil: SecaoPerfil[] = [
  {
    id: "sobre",
    titulo: "Sobre o Aplicativo",
    tipoIcone: "info",
    Conteudo: ConteudoSobreAplicativo,
  },
  {
    id: "aviso_medico",
    titulo: "Aviso Médico Obrigatório",
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