import Cliente from "../models/Cliente.js";

export const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        console.error("getClientes error", error);
        res.status(500).json({
            mensaje: "Error al obtener clientes",
            error: error.message,
        });
    }
};

export const createCliente = async (req, res) => {
    try {
        const nuevo = await Cliente.create(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        console.error("createCliente error", error);
        res.status(400).json({
            mensaje: "Error al crear cliente",
            error: error.message,
        });
    }
};
