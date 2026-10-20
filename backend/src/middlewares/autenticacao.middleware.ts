import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function autenticarToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.dermascan_token;

  if (typeof token !== "string" || !token) {
    res.status(401).json({
      error: "Token não informado.",
    });
    return;
  }

  const segredo = process.env.JWT_SECRET;

  if (!segredo) {
    console.error("JWT_SECRET não configurado.");

    res.status(500).json({
      error: "Serviço de autenticação indisponível.",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, segredo);

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      !payload.sub.trim()
    ) {
      res.status(401).json({
        error: "Token inválido.",
      });
      return;
    }

    req.usuarioId = payload.sub;
    next();
  } catch {
    res.status(401).json({
      error: "Token inválido ou expirado.",
    });
  }
}
