import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        telefono: { type: String, required: true },
        ciudad: { type: String },
        // statistics that will be incremented when a sale is recorded
        totalGastado: { type: Number, default: 0 },
        compras: { type: Number, default: 0 },
    },
    { timestamps: true },
);

export default mongoose.model("Cliente", clienteSchema);
