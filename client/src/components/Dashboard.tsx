import { useEffect, useState } from "react";
import { getProductos, getClientes, getVentas } from "../lib/api";
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react";

interface DashboardStats {
    totalProductos: number;
    totalClientes: number;
    totalVentas: number;
    valorInventario: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProductos: 0,
        totalClientes: 0,
        totalVentas: 0,
        valorInventario: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [productos, clientes, ventas] = await Promise.all([
                getProductos(),
                getClientes(),
                getVentas(),
            ]);

            const totalProductos = productos.length;
            const totalClientes = clientes.length;
            const totalVentas = ventas.reduce(
                (sum, v) => sum + Number(v.total),
                0,
            );
            const valorInventario = productos.reduce(
                (sum, p) => sum + Number(p.precio) * p.stock,
                0,
            );

            setStats({
                totalProductos,
                totalClientes,
                totalVentas,
                valorInventario,
            });
        } catch (error) {
            console.error("Error al cargar estadísticas:", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: "Total Productos",
            value: stats.totalProductos,
            icon: Package,
            color: "bg-blue-500",
            textColor: "text-blue-600",
        },
        {
            title: "Total Clientes",
            value: stats.totalClientes,
            icon: Users,
            color: "bg-green-500",
            textColor: "text-green-600",
        },
        {
            title: "Ventas Totales",
            value: `€${stats.totalVentas.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`,
            icon: ShoppingCart,
            color: "bg-orange-500",
            textColor: "text-orange-600",
        },
        {
            title: "Valor Inventario",
            value: `€${stats.valorInventario.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`,
            icon: TrendingUp,
            color: "bg-purple-500",
            textColor: "text-purple-600",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Panel de Control
                </h2>
                <p className="text-gray-600">
                    Vista general del sistema de inventario
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className={`p-3 rounded-lg ${card.color} bg-opacity-10`}
                                >
                                    <Icon
                                        className={`w-6 h-6 ${card.textColor}`}
                                    />
                                </div>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">
                                {card.title}
                            </h3>
                            <p className="text-2xl font-bold text-gray-800">
                                {card.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                    Bienvenido a Tech-Inventory Pro
                </h3>
                <p className="text-blue-700">
                    Sistema completo de gestión de inventario tecnológico.
                    Utiliza el menú de navegación para gestionar productos,
                    categorías, clientes, ventas y proveedores.
                </p>
            </div>
        </div>
    );
}
