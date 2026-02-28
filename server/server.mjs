import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import productoRoutes from "./routes/productoRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import proveedorRoutes from "./routes/proveedorRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";
import dns from "node:dns";
import "dotenv/config";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

app.get("/", (req, res) => {
    res.json({ mensaje: "API de Tech-Inventory Pro activa" });
});

app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/ventas", ventaRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
