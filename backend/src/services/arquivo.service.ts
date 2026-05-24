import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

interface ImagemSalva {
  caminhoRelativo: string;
}

function obterExtensaoImagem(imageBase64: string): string {
  const match = imageBase64.match(/^data:image\/(png|jpeg|jpg|webp);base64,/);

  if (!match) return "jpg";

  const tipo = match[1];

  if (tipo === "jpeg") return "jpg";

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