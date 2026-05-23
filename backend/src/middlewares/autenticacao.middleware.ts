import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface PayloadJwt {
  sub: string;
}

export function autenticarToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.dermascan_token;

  if (!token) {
    res.status(401).json({
      error: "Token não informado.",
    });
    return;
  }

  const segredo = process.env.JWT_SECRET;

  if (!segredo) {
    res.status(500).json({
      error: "JWT_SECRET não configurado.",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, segredo) as PayloadJwt;

    req.usuarioId = payload.sub;

    next();
  } catch {
    res.status(401).json({
      error: "Token inválido ou expirado.",
    });
  }
}