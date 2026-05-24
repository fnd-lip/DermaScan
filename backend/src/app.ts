import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { authRoutes } from "./routes/auth.routes";
import { classificacaoRoutes } from "./routes/classificacao.routes";
import path from "path";

dotenv.config();

const app = express();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  return res.json({
    status: "ok",
    mensagem: "Backend DermaScan rodando",
  });
});

app.use("/auth", authRoutes);
app.use("/api", classificacaoRoutes);

app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads")),
);

export { app };