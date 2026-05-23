import { Router } from "express";
import {
  loginUsuario,
  logoutUsuario,
  obterUsuarioAtual,
  registrarUsuario,
} from "../controller/auth.controller";
import { autenticarToken } from "../middlewares/autenticacao.middleware";

const authRoutes = Router();

authRoutes.post("/register", registrarUsuario);
authRoutes.post("/login", loginUsuario);
authRoutes.get("/me", autenticarToken, obterUsuarioAtual);
authRoutes.post("/logout", logoutUsuario);

export { authRoutes };