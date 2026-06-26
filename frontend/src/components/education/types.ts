import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

export interface ArtigoEducativo {
  id: string;
  titulo: string;
  sumario: string;
  Icone: LucideIcon;
  classeIcone: string;
  Conteudo: ComponentType;
}