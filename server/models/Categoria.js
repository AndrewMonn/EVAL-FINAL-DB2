import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true },
        descripcion: { type: String, required: true },
        activa: { type: Boolean, default: true },
        codigo: { type: String, required: true, unique: true },
    },
    { timestamps: true },
);

export default mongoose.model("Categoria", categoriaSchema);
