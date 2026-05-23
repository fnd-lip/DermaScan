import { Request, Response } from "express";
import { autenticarUsuario, cadastrarUsuario } from "../services/auth.service";
import { prisma } from "../database/prisma";

const cookieName = "dermascan_token";

function configurarCookieToken(res: Response, token: string) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

export async function registrarUsuario(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      res.status(400).json({
        error: "Nome, e-mail e senha são obrigatórios.",
      });
      return;
    }

    if (senha.length < 6) {
      res.status(400).json({
        error: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    const usuario = await cadastrarUsuario({
      nome,
      email,
      senha,
    });

    res.status(201).json({
      usuario,
      mensagem: "Usuário cadastrado com sucesso.",
    });
  } catch (erro) {
    const mensagem =
      erro instanceof Error ? erro.message : "Erro ao cadastrar usuário.";

    res.status(400).json({
      error: mensagem,
    });
  }
}

export async function loginUsuario(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({
        error: "E-mail e senha são obrigatórios.",
      });
      return;
    }

    const { token, usuario } = await autenticarUsuario({
      email,
      senha,
    });

    configurarCookieToken(res, token);

    res.json({
      usuario,
      mensagem: "Login realizado com sucesso.",
    });
  } catch (erro) {
    const mensagem =
      erro instanceof Error ? erro.message : "Erro ao realizar login.";

    res.status(401).json({
      error: mensagem,
    });
  }
}

export async function obterUsuarioAtual(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const usuarioId = req.usuarioId;

    if (!usuarioId) {
      res.status(401).json({
        error: "Usuário não autenticado.",
      });
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    if (!usuario) {
      res.status(404).json({
        error: "Usuário não encontrado.",
      });
      return;
    }

    res.json({
      usuario,
    });
  } catch {
    res.status(500).json({
      error: "Erro ao buscar usuário autenticado.",
    });
  }
}

export function logoutUsuario(_req: Request, res: Response): void {
  res.clearCookie(cookieName);

  res.json({
    mensagem: "Logout realizado com sucesso.",
  });
}