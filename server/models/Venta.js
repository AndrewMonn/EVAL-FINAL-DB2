import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema(
    {
        cliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cliente",
            required: true,
        },
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Producto",
            required: true,
        },
        cantidad: { type: Number, required: true, min: 1 },
        total: { type: Number, required: true, min: 0 },
        fechaVenta: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

export default mongoose.model("Venta", ventaSchema);
