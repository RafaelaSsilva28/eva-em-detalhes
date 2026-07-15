import express from "express";

import {
  cadastrarUsuario,
  login,
  listarUsuarios,
  atualizarUsuario,
  excluirUsuario
} from "../controllers/usuariosController.js";

import autenticarToken from "../middlewares/autenticarToken.js";

const router = express.Router();

router.post(
  "/login",
  login
);

router.post(
  "/usuarios",
  autenticarToken,
  cadastrarUsuario
);

router.get(
  "/usuarios",
  autenticarToken,
  listarUsuarios
);

router.patch(
  "/usuarios/:id",
  autenticarToken,
  atualizarUsuario
);

router.delete(
  "/usuarios/:id",
  autenticarToken,
  excluirUsuario
);

export default router;