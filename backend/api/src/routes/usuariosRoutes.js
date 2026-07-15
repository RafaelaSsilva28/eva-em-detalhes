import express from "express";

import {
  cadastrarUsuario,
  login,
  listarUsuarios,
  buscarUsuarioPorId,
  atualizarUsuario,
  excluirUsuario,
  buscarPerfilUsuario,
  atualizarPerfilUsuario,
  alterarSenhaUsuario
} from "../controllers/usuariosController.js";

import autenticarToken from "../middlewares/autenticarToken.js";

const router = express.Router();

router.post(
  "/login",
  login
);

router.get(
  "/usuarios/perfil",
  autenticarToken,
  buscarPerfilUsuario
);

router.patch(
  "/usuarios/perfil",
  autenticarToken,
  atualizarPerfilUsuario
);

router.patch(
  "/usuarios/perfil/senha",
  autenticarToken,
  alterarSenhaUsuario
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

router.get(
  "/usuarios/:id",
  autenticarToken,
  buscarUsuarioPorId
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