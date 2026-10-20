import type { Request, Response } from "express";
import { configurarCookieToken } from "./auth.controller";
import {
  autenticarComGoogle,
  ErroAutenticacaoGoogle,
} from "../services/auth.google.service";

export async function loginGoogle(req: Request, res: Response): Promise<void> {
  const credential = req.body?.credential;

  if (typeof credential !== "string" || !credential.trim()) {
    res.status(400).json({
      error: "Credencial Google não informada.",
    });
    return;
  }

  try {
    const { token, usuario } = await autenticarComGoogle(credential);

    configurarCookieToken(res, token);

    res.status(200).json({
      usuario,
      mensagem: "Login com Google realizado com sucesso.",
    });
  } catch (error_) {
    if (error_ instanceof ErroAutenticacaoGoogle) {
      res.status(error_.status).json({
        error: error_.message,
      });
      return;
    }

    console.error("Erro na autenticação Google:", error_);

    res.status(500).json({
      error: "Não foi possível autenticar com Google.",
    });
  }
}
