import Venta from "../models/Venta.js";

export const getVentas = async (req, res) => {
    try {
        const ventas = await Venta.find().populate("producto cliente");
        res.json(ventas);
    } catch (error) {
        console.error("getVentas error", error);
        res.status(500).json({
            mensaje: "Error al obtener ventas",
            error: error.message,
        });
    }
};

import Cliente from "../models/Cliente.js";

export const createVenta = async (req, res) => {
    try {
        const nueva = await Venta.create(req.body);
        // after creating a sale, update client statistics
        if (req.body.cliente) {
            const clienteId = req.body.cliente;
            const cantidad = Number(req.body.cantidad) || 0;
            const total = Number(req.body.total) || 0;
            await Cliente.findByIdAndUpdate(clienteId, {
                $inc: { totalGastado: total, compras: cantidad },
            });
        }

        const ventaCreada = await Venta.findById(nueva._id).populate(
            "producto cliente",
        );
        res.status(201).json(ventaCreada);
    } catch (error) {
        console.error("createVenta error", error);
        res.status(400).json({
            mensaje: "Error al crear venta",
            error: error.message,
        });
    }
};
