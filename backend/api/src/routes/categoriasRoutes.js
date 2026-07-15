import express from "express";

import {
  cadastrarCategoria,
  listarCategorias,
  listarCategoriasInativas,
  buscarCategoriaPorId,
  atualizarCategoria,
  excluirCategoria
} from "../controllers/categoriasController.js";

import autenticarToken from "../middlewares/autenticarToken.js";

const router = express.Router();

router.get(
  "/categorias",
  listarCategorias
);

router.get(
  "/categorias/inativas",
  autenticarToken,
  listarCategoriasInativas
);

router.get(
  "/categorias/:id",
  buscarCategoriaPorId
);

router.post(
  "/categorias",
  autenticarToken,
  cadastrarCategoria
);

router.patch(
  "/categorias/:id",
  autenticarToken,
  atualizarCategoria
);

router.delete(
  "/categorias/:id",
  autenticarToken,
  excluirCategoria
);

export default router;