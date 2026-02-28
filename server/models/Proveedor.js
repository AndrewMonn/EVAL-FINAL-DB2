import mongoose from "mongoose";

// provider schema updated to match frontend fields
const proveedorSchema = new mongoose.Schema(
    {
        empresa: { type: String, required: true },
        contacto: { type: String },
        pais: { type: String },
        categoria_suministro: { type: String },
    },
    {
        timestamps: true,
        collection: "proveedores",

        // 2. Mantenemos la transformación del ID para React
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    },
);

export default mongoose.model("Proveedor", proveedorSchema);
