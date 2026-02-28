import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Categoria from "./models/Categoria.js";
import Producto from "./models/Producto.js";
import Cliente from "./models/Cliente.js";
import Proveedor from "./models/Proveedor.js";
import Venta from "./models/Venta.js";

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        await Promise.all([
            Categoria.deleteMany({}),
            Producto.deleteMany({}),
            Cliente.deleteMany({}),
            Proveedor.deleteMany({}),
            Venta.deleteMany({}),
        ]);

        const categorias = await Categoria.insertMany([
            {
                nombre: "Laptops",
                descripcion: "Portátiles para trabajo y gaming",
                activa: true,
                codigo: "CAT-LAP",
            },
            {
                nombre: "Periféricos",
                descripcion: "Mouse, teclados y accesorios",
                activa: true,
                codigo: "CAT-PER",
            },
            {
                nombre: "Monitores",
                descripcion: "Pantallas y monitores LED",
                activa: true,
                codigo: "CAT-MON",
            },
            {
                nombre: "Redes",
                descripcion: "Equipos y accesorios de red",
                activa: true,
                codigo: "CAT-RED",
            },
        ]);

        // insert sample providers using the new schema
        const proveedores = await Proveedor.insertMany([
            {
                empresa: "TechNova",
                contacto: "Juan Pérez",
                pais: "México",
                categoria_suministro: "Laptops",
            },
            {
                empresa: "CompuGlobal",
                contacto: "María López",
                pais: "España",
                categoria_suministro: "Periféricos",
            },
            {
                empresa: "DigitalWare",
                contacto: "Carlos Sánchez",
                pais: "Argentina",
                categoria_suministro: "Redes",
            },
            {
                empresa: "Nexa Supplies",
                contacto: "Luisa Fernández",
                pais: "Chile",
                categoria_suministro: "Monitores",
            },
        ]);

        // include stats fields on client docs so that the schema change has defaults
        const clientes = await Cliente.insertMany([
            {
                nombre: "Ana Martínez",
                email: "ana@email.com",
                telefono: "555-2001",
                ciudad: "Ciudad de México",
                totalGastado: 0,
                compras: 0,
            },
            {
                nombre: "Luis Gómez",
                email: "luis@email.com",
                telefono: "555-2002",
                ciudad: "Monterrey",
                totalGastado: 0,
                compras: 0,
            },
            {
                nombre: "Carla Ruiz",
                email: "carla@email.com",
                telefono: "555-2003",
                ciudad: "Guadalajara",
                totalGastado: 0,
                compras: 0,
            },
            {
                nombre: "Pedro Salas",
                email: "pedro@email.com",
                telefono: "555-2004",
                ciudad: "Puebla",
                totalGastado: 0,
                compras: 0,
            },
        ]);

        const productos = await Producto.insertMany([
            {
                nombre: "Laptop Pro 14",
                descripcion: "Laptop de alto rendimiento 16GB RAM",
                precio: 28000,
                stock: 7,
                categoria: categorias[0]._id,
                proveedor: proveedores[0]._id,
            },
            {
                nombre: "Mouse Inalámbrico X",
                descripcion: "Mouse ergonómico con sensor óptico",
                precio: 600,
                stock: 35,
                categoria: categorias[1]._id,
                proveedor: proveedores[1]._id,
            },
            {
                nombre: "Monitor 27 4K",
                descripcion: "Monitor UHD para diseño y edición",
                precio: 8900,
                stock: 5,
                categoria: categorias[2]._id,
                proveedor: proveedores[2]._id,
            },
            {
                nombre: "Router AX3000",
                descripcion: "Router WiFi 6 de doble banda",
                precio: 2200,
                stock: 12,
                categoria: categorias[3]._id,
                proveedor: proveedores[3]._id,
            },
        ]);

        await Venta.insertMany([
            {
                cliente: clientes[0]._id,
                producto: productos[0]._id,
                cantidad: 1,
                total: 28000,
            },
            {
                cliente: clientes[1]._id,
                producto: productos[1]._id,
                cantidad: 2,
                total: 1200,
            },
            {
                cliente: clientes[2]._id,
                producto: productos[2]._id,
                cantidad: 1,
                total: 8900,
            },
            {
                cliente: clientes[3]._id,
                producto: productos[3]._id,
                cantidad: 1,
                total: 2200,
            },
        ]);

        console.log("✅ Seed completado: 4 documentos en cada colección.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error en seed:", error);
        process.exit(1);
    }
};

seedData();
