import Proveedor from "../models/Proveedor.js";

export const getProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find();
        res.json(proveedores);
    } catch (error) {
        console.error("getProveedores error", error);
        res.status(500).json({
            mensaje: "Error al obtener proveedores",
            error: error.message,
        });
    }
};

export const createProveedor = async (req, res) => {
    try {
        const nuevo = await Proveedor.create(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        console.error("createProveedor error", error);
        res.status(400).json({
            mensaje: "Error al crear proveedor",
            error: error.message,
        });
    }
};
