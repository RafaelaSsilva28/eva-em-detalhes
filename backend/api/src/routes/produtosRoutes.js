import express from "express";

import {
  cadastrarProduto,
  listarProdutos,
  listarProdutosInativos,
  buscarProdutoPorId,
  atualizarProduto,
  excluirProduto
} from "../controllers/produtosController.js";

import autenticarToken from "../middlewares/autenticarToken.js";

const router = express.Router();

router.get(
  "/produtos",
  listarProdutos
);

router.get(
  "/produtos/inativos",
  autenticarToken,
  listarProdutosInativos
);

router.get(
  "/produtos/:id",
  buscarProdutoPorId
);

router.post(
  "/produtos",
  autenticarToken,
  cadastrarProduto
);

router.patch(
  "/produtos/:id",
  autenticarToken,
  atualizarProduto
);

router.delete(
  "/produtos/:id",
  autenticarToken,
  excluirProduto
);

export default router;