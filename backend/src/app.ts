import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { authRoutes } from "./routes/auth.routes";
import { classificacaoRoutes } from "./routes/classificacao.routes";

dotenv.config();

const app = express();

const origensPermitidas = [
  "http://localhost",
  "http://localhost:5173",
  "http://127.0.0.1",
  "http://127.0.0.1:5173",
  ...(process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
    : []),
];

app.use(
  cors({
    origin: origensPermitidas,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "15mb" }));

app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads")),
);

app.get("/health", (_req, res) => {
  return res.json({
    status: "ok",
    mensagem: "Backend DermaScan rodando",
  });
});

app.use("/auth", authRoutes);
app.use("/api", classificacaoRoutes);

export { app };