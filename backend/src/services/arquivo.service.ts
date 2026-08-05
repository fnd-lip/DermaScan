import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

interface ImagemSalva {
  caminhoRelativo: string;
}

type ExtensaoImagem = "jpg" | "png" | "webp";

const PADRAO_DATA_URL_IMAGEM = /^data:image\/(png|jpeg|jpg|webp);base64,/;

const PASTA_BASE_ANALISES = path.resolve(process.cwd(), "uploads", "analises");

function obterExtensaoImagem(imageBase64: string): ExtensaoImagem {
  const correspondencia = PADRAO_DATA_URL_IMAGEM.exec(imageBase64);

  if (!correspondencia) {
    return "jpg";
  }

  switch (correspondencia[1]) {
    case "png":
      return "png";

    case "webp":
      return "webp";

    case "jpeg":
    case "jpg":
    default:
      return "jpg";
  }
}

function removerPrefixoBase64(imageBase64: string): string {
  const posicaoVirgula = imageBase64.indexOf(",");

  if (posicaoVirgula >= 0) {
    return imageBase64.slice(posicaoVirgula + 1);
  }

  return imageBase64;
}

export async function salvarImagemBase64(
  imageBase64: string,
): Promise<ImagemSalva> {
  const extensao = obterExtensaoImagem(imageBase64);
  const base64Limpo = removerPrefixoBase64(imageBase64);
  const buffer = Buffer.from(base64Limpo, "base64");

  const nomeArquivo = `${randomUUID()}.${extensao}`;

  await mkdir(PASTA_BASE_ANALISES, {
    recursive: true,
  });

  const caminhoAbsoluto = path.resolve(PASTA_BASE_ANALISES, nomeArquivo);

  if (path.dirname(caminhoAbsoluto) !== PASTA_BASE_ANALISES) {
    throw new Error("Caminho de destino inválido.");
  }

  await writeFile(caminhoAbsoluto, buffer, {
    flag: "wx",
  });

  return {
    caminhoRelativo: `/uploads/analises/${nomeArquivo}`,
  };
}
