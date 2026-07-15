import express from "express";
import upload from "../middlewares/upload.js";
import autenticarToken from "../middlewares/autenticarToken.js";

import {
  listarImagensProduto,
  cadastrarImagensProduto,
  definirImagemPrincipal,
  excluirImagemProduto
} from "../controllers/imagensController.js";

const router = express.Router();

router.get(
  "/produtos/:id/imagens",
  listarImagensProduto
);

router.post(
  "/produtos/:id/imagens",
  autenticarToken,
  upload.array("imagens", 10),
  cadastrarImagensProduto
);

router.patch(
  "/produtos/:id/imagens/:idImagem/principal",
  autenticarToken,
  definirImagemPrincipal
);

router.delete(
  "/produtos/:id/imagens/:idImagem",
  autenticarToken,
  excluirImagemProduto
);

export default router;