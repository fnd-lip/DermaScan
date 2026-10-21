import { Router, urlencoded } from "express";
import {
  loginUsuario,
  logoutUsuario,
  obterUsuarioAtual,
  registrarUsuario,
} from "../controller/auth.controller";
import { loginGoogle } from "../controller/auth.google.controller";
import { loginGoogleRedirect } from "../controller/auth.google.redirect.controller";
import { autenticarToken } from "../middlewares/autenticacao.middleware";

const authRoutes = Router();

authRoutes.post("/register", registrarUsuario);
authRoutes.post("/login", loginUsuario);
authRoutes.post("/google", loginGoogle);

authRoutes.post(
  "/google/redirect",
  urlencoded({ extended: false, limit: "16kb" }),
  loginGoogleRedirect,
);

authRoutes.get("/me", autenticarToken, obterUsuarioAtual);
authRoutes.post("/logout", logoutUsuario);

export { authRoutes };
