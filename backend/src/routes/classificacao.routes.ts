import { Router } from "express";
import {
  classificarImagem,
  excluirAnalise,
  limparAnalises,
  listarAnalises,
} from "../controller/classificacao.controller";
import { autenticarToken } from "../middlewares/autenticacao.middleware";

const classificacaoRoutes = Router();

classificacaoRoutes.use(autenticarToken);

classificacaoRoutes.post("/classify", classificarImagem);
classificacaoRoutes.get("/analyses", listarAnalises);
classificacaoRoutes.delete("/analyses/:id", excluirAnalise);
classificacaoRoutes.delete("/analyses", limparAnalises);

export { classificacaoRoutes };