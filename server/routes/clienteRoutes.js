import express from "express";
import {
    getClientes,
    createCliente,
} from "../controllers/clienteController.js";

const router = express.Router();

router.get("/", getClientes);
router.post("/", createCliente);

export default router;
