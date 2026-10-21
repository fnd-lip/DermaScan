import { timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { configurarCookieToken } from "./auth.controller";
import {
  autenticarComGoogle,
  ErroAutenticacaoGoogle,
} from "../services/auth.google.service";

function validarCsrf(req: Request): boolean {
  const csrfBody = req.body?.g_csrf_token;
  const csrfCookie = req.cookies?.g_csrf_token;

  if (
    typeof csrfBody !== "string" ||
    typeof csrfCookie !== "string" ||
    !csrfBody ||
    !csrfCookie
  ) {
    return false;
  }

  const valorBody = Buffer.from(csrfBody);
  const valorCookie = Buffer.from(csrfCookie);

  return (
    valorBody.length === valorCookie.length &&
    timingSafeEqual(valorBody, valorCookie)
  );
}

function responderErro(res: Response, status: number, mensagem: string): void {
  res.status(status).type("html").send(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>Login Google - DermaScan</title>
      </head>
      <body style="font:16px system-ui;padding:48px;max-width:520px;margin:auto">
        <h1>Não foi possível entrar</h1>
        <p>${mensagem}</p>
        <a href="/">Voltar ao DermaScan</a>
      </body>
    </html>
  `);
}

export async function loginGoogleRedirect(
  req: Request,
  res: Response,
): Promise<void> {
  if (!validarCsrf(req)) {
    responderErro(res, 403, "A validação de segurança falhou.");
    return;
  }

  const credential = req.body?.credential;

  if (typeof credential !== "string" || !credential.trim()) {
    responderErro(res, 400, "O Google não enviou uma credencial válida.");
    return;
  }

  try {
    const { token } = await autenticarComGoogle(credential);

    configurarCookieToken(res, token);

    res.redirect(303, "/");
  } catch (error_) {
    if (error_ instanceof ErroAutenticacaoGoogle) {
      const mensagem =
        error_.status === 409
          ? "Já existe uma conta com este e-mail. Entre com sua senha."
          : "Não foi possível validar a conta Google.";

      responderErro(res, error_.status, mensagem);
      return;
    }

    console.error("Erro no redirecionamento Google:", error_);
    responderErro(res, 500, "Tente novamente em alguns instantes.");
  }
}
