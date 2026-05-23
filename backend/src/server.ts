import dotenv from "dotenv";
import { app } from "./app";

dotenv.config();

const porta = Number(process.env.PORT) || 4000;

app.listen(porta, () => {
  console.log(`Backend rodando em http://localhost:${porta}`);
});