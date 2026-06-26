import { AlertTriangle, BookOpen, Stethoscope, Sun } from "lucide-react";
import { ConteudoABCDE } from "./ConteudoABCDE";
import { ConteudoLesoesDermatologicas } from "./ConteudoLesoesDermatologicas";
import { ConteudoPrevencaoSolar } from "./ConteudoPrevencaoSolar";
import { ConteudoLimitacoesIA } from "./ConteudoLimitacoesIA";
import type { ArtigoEducativo } from "./types";

export const artigosEducativos: ArtigoEducativo[] = [
  {
    id: "abcde",
    Icone: BookOpen,
    classeIcone: "text-teal-600",
    titulo: "Regra ABCDE de sinais de pele",
    sumario:
      "Entenda pontos visuais importantes para observar pintas e manchas.",
    Conteudo: ConteudoABCDE,
  },
  {
    id: "dermatologia",
    Icone: Stethoscope,
    classeIcone: "text-indigo-600",
    titulo: "O que são lesões dermatológicas?",
    sumario:
      "Compreenda de forma simples o que são manchas, pintas e alterações na pele.",
    Conteudo: ConteudoLesoesDermatologicas,
  },
  {
    id: "sol",
    Icone: Sun,
    classeIcone: "text-amber-500",
    titulo: "Prevenção e cuidados com exposição solar",
    sumario:
      "Hábitos práticos para reduzir riscos associados à exposição solar excessiva.",
    Conteudo: ConteudoPrevencaoSolar,
  },
  {
    id: "limitacoes",
    Icone: AlertTriangle,
    classeIcone: "text-red-500",
    titulo: "Limitações da inteligência artificial em saúde",
    sumario:
      "Entenda por que a análise assistida não substitui avaliação médica.",
    Conteudo: ConteudoLimitacoesIA,
  },
];