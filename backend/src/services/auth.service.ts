import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { prisma } from "../database/prisma";

interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
}

interface DadosLogin {
  email: string;
  senha: string;
}

export async function cadastrarUsuario({ nome, email, senha }: DadosCadastro) {
  const emailNormalizado = email.trim().toLowerCase();

  const usuarioExistente = await prisma.usuario.findUnique({
    where: {
      email: emailNormalizado,
    },
  });

  if (usuarioExistente) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome: nome.trim(),
      email: emailNormalizado,
      senhaHash,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      criadoEm: true,
    },
  });

  return usuario;
}

export async function autenticarUsuario({ email, senha }: DadosLogin) {
  const emailNormalizado = email.trim().toLowerCase();

  const usuario = await prisma.usuario.findUnique({
    where: {
      email: emailNormalizado,
    },
  });

  if (!usuario) {
    throw new Error("E-mail ou senha inválidos.");
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

  if (!senhaValida) {
    throw new Error("E-mail ou senha inválidos.");
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

export function gerarTokenJwt(usuarioId: string): string {
  const segredo = process.env.JWT_SECRET;

  if (!segredo) {
    throw new Error("JWT_SECRET não configurado.");
  }

  const opcoes: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      sub: usuarioId,
    },
    segredo as Secret,
    opcoes,
  );
}