import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

import { testarConexao } from "./config/db.js";
import documentacao from "./config/swagger.js";

import usuariosRoutes from "./routes/usuariosRoutes.js";
import categoriasRoutes from "./routes/categoriasRoutes.js";
import produtosRoutes from "./routes/produtosRoutes.js";
import imagensRoutes from "./routes/imagensRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

const pastaUploads =
  process.env.UPLOAD_DIR ||
  path.join(__dirname, "..", "uploads");

app.use(
  "/uploads",
  express.static(pastaUploads)
);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(documentacao)
);

app.get("/", (req, res) => {
  return res.status(200).json({
    mensagem: "API EVA em Detalhes funcionando.",
    documentacao: `${req.protocol}://${req.get("host")}/docs`
  });
});

app.use(usuariosRoutes);
app.use(categoriasRoutes);
app.use(produtosRoutes);
app.use(imagensRoutes);
app.use(dashboardRoutes);

app.use((erro, req, res, next) => {
  if (erro.name === "MulterError") {
    if (erro.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        mensagem: "Cada imagem pode possuir no máximo 5 MB."
      });
    }

    if (erro.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        mensagem: "Envie no máximo 10 imagens por vez."
      });
    }

    return res.status(400).json({
      mensagem: "Erro ao realizar upload das imagens."
    });
  }

  if (
    erro.message ===
    "Formato inválido. Envie imagens JPG, PNG ou WEBP."
  ) {
    return res.status(400).json({
      mensagem: erro.message
    });
  }

  console.error("Erro não tratado:", erro);

  return res.status(500).json({
    mensagem: "Erro interno do servidor."
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
  console.log(`Swagger disponível em http://localhost:${PORT}/docs`);
  console.log(`Uploads servidos a partir de: ${pastaUploads}`);

  await testarConexao();
});