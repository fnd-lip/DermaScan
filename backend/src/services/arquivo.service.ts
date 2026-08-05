import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

interface ImagemSalva {
  caminhoRelativo: string;
}

const PADRAO_DATA_URL_IMAGEM = /^data:image\/(png|jpeg|jpg|webp);base64,/;

function obterExtensaoImagem(imageBase64: string): string {
  const correspondencia = PADRAO_DATA_URL_IMAGEM.exec(imageBase64);

  if (!correspondencia) {
    return "jpg";
  }

  const tipo = correspondencia[1];

  if (tipo === "jpeg") {
    return "jpg";
  }

  return tipo;
}

function removerPrefixoBase64(imageBase64: string): string {
  if (imageBase64.includes(",")) {
    return imageBase64.split(",")[1];
  }

  return imageBase64;
}

export async function salvarImagemBase64(
  imageBase64: string,
  usuarioId: string,
): Promise<ImagemSalva> {
  const extensao = obterExtensaoImagem(imageBase64);
  const base64Limpo = removerPrefixoBase64(imageBase64);
  const buffer = Buffer.from(base64Limpo, "base64");

  const nomeArquivo = `${randomUUID()}.${extensao}`;

  const pastaRelativa = path.join("uploads", "analises", usuarioId);
  const pastaAbsoluta = path.resolve(process.cwd(), pastaRelativa);

  await mkdir(pastaAbsoluta, {
    recursive: true,
  });

  const caminhoAbsoluto = path.join(pastaAbsoluta, nomeArquivo);

  await writeFile(caminhoAbsoluto, buffer);

  return {
    caminhoRelativo: `/uploads/analises/${usuarioId}/${nomeArquivo}`,
  };
}
