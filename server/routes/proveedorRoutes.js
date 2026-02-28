import express from "express";
import {
    getProveedores,
    createProveedor,
} from "../controllers/proveedorController.js";

const router = express.Router();

router.get("/", getProveedores);
router.post("/", createProveedor);

export default router;
