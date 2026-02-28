import dns from "node:dns";
import "dotenv/config";
import mongoose from "mongoose";

// Force model registration so populate() works later
import "../models/Categoria.js";
import "../models/Proveedor.js";
import "../models/Cliente.js";
import "../models/Venta.js";
import "../models/Producto.js";

// Configuración de DNS antes de cualquier operación de red
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    const clientOptions = {
        serverApi: {
            version: "1",
            strict: true,
            deprecationErrors: true,
        },
    };

    if (!uri || typeof uri !== "string") {
        console.error(
            "❌ MONGODB_URI no está definida. Configura server/.env con tu cadena de conexión de MongoDB Atlas.",
        );
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, clientOptions);
        console.log(
            "✅ MongoDB conectada correctamente usando MONGODB_URI (SRV).",
        );
    } catch (error) {
        const isSrvDnsError =
            typeof error?.message === "string" &&
            (error.message.includes("querySrv ECONNREFUSED") ||
                error.message.includes("ENOTFOUND"));

        console.error("❌ Error conectando a MongoDB:", error.message);

        if (isSrvDnsError) {
            console.error(
                "💡 Tu red/DNS está bloqueando consultas SRV. Usa MONGODB_URI_DIRECT en server/.env con el formato mongodb://host1,host2,host3/... de Atlas.",
            );
        }
        process.exit(1);
    }
};

export default connectDB;
