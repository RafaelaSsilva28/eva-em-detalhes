import express from "express";

import {
  buscarDadosDashboard
} from "../controllers/dashboardController.js";

import autenticarToken from "../middlewares/autenticarToken.js";

const router = express.Router();

router.get(
  "/dashboard",
  autenticarToken,
  buscarDadosDashboard
);

export default router;