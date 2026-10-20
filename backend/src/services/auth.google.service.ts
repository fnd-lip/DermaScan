import { OAuth2Client } from "google-auth-library";
import { prisma } from "../database/prisma";
import { gerarTokenJwt } from "./auth.service";

export class ErroAutenticacaoGoogle extends Error {
  readonly status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = "ErroAutenticacaoGoogle";
    this.status = status;
  }
}

export async function autenticarComGoogle(credential: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID não configurado.");
  }

  const cliente = new OAuth2Client(clientId);

  let payload;

  try {
    const ticket = await cliente.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    payload = ticket.getPayload();
  } catch {
    throw new ErroAutenticacaoGoogle(
      "Credencial Google inválida ou expirada.",
      401,
    );
  }

  if (!payload?.sub || !payload.email || !payload.email_verified) {
    throw new ErroAutenticacaoGoogle(
      "Não foi possível validar a conta Google.",
      401,
    );
  }

  const googleId = payload.sub;
  const email = payload.email.trim().toLowerCase();

  let usuario = await prisma.usuario.findUnique({
    where: { googleId },
  });

  if (!usuario) {
    const contaExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (contaExistente) {
      throw new ErroAutenticacaoGoogle(
        "Já existe uma conta com este e-mail. Entre com sua senha.",
        409,
      );
    }

    usuario = await prisma.usuario.create({
      data: {
        nome: payload.name?.trim() || email.split("@")[0],
        email,
        googleId,
        senhaHash: null,
      },
    });
  }

  const token = gerarTokenJwt(usuario.id);

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
  };
}
