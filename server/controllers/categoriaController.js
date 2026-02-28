import Categoria from "../models/Categoria.js";

export const getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (error) {
        console.error("getCategorias error", error);
        res.status(500).json({
            mensaje: "Error al obtener categorías",
            error: error.message,
        });
    }
};

export const createCategoria = async (req, res) => {
    try {
        const nueva = await Categoria.create(req.body);
        res.status(201).json(nueva);
    } catch (error) {
        console.error("createCategoria error", error);
        res.status(400).json({
            mensaje: "Error al crear categoría",
            error: error.message,
        });
    }
};
