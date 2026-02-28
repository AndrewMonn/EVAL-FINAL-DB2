import express from "express";
import { getVentas, createVenta } from "../controllers/ventaController.js";

const router = express.Router();

router.get("/", getVentas);
router.post("/", createVenta);

export default router;
