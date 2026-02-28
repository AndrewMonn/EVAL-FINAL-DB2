import Producto from "../models/Producto.js";

export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.find().populate("categoria proveedor");
        res.json(productos);
    } catch (error) {
        console.error("getProductos error", error);
        res.status(500).json({
            mensaje: "Error al obtener productos",
            error: error.message,
        });
    }
};

export const getProductosBajos = async (req, res) => {
    try {
        const productos = await Producto.find({ stock: { $lt: 10 } }).populate(
            "categoria proveedor",
        );
        res.json(productos);
    } catch (error) {
        console.error("getProductosBajos error", error);
        res.status(500).json({
            mensaje: "Error al obtener productos bajos en stock",
            error: error.message,
        });
    }
};

export const getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id).populate(
            "categoria proveedor",
        );
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        console.error("getProductoById error", error);
        res.status(500).json({
            mensaje: "Error al obtener el producto",
            error: error.message,
        });
    }
};

export const createProducto = async (req, res) => {
    try {
        const nuevoProducto = await Producto.create(req.body);
        const productoCreado = await Producto.findById(
            nuevoProducto._id,
        ).populate("categoria proveedor");
        res.status(201).json(productoCreado);
    } catch (error) {
        console.error("createProducto error", error);
        res.status(400).json({
            mensaje: "Error al crear producto",
            error: error.message,
        });
    }
};

export const updateProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            },
        ).populate("categoria proveedor");

        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json(producto);
    } catch (error) {
        console.error("updateProducto error", error);
        res.status(400).json({
            mensaje: "Error al actualizar producto",
            error: error.message,
        });
    }
};

export const deleteProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar producto",
            error: error.message,
        });
    }
};
