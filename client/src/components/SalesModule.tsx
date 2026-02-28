import { useEffect, useState } from "react";
import {
    Cliente,
    Producto,
    getClientes,
    getProductos,
    createVenta,
} from "../lib/api";
import { Plus, X } from "lucide-react";
import SimpleTable from "./SimpleTable";

export default function SalesModule() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);

    const [formData, setFormData] = useState({
        producto: "",
        cliente: "",
        cantidad: "",
        total: "",
    });

    useEffect(() => {
        loadLists();
    }, []);

    const loadLists = async () => {
        try {
            const [p, c] = await Promise.all([getProductos(), getClientes()]);
            setProductos(p);
            setClientes(c);
        } catch (err) {
            console.error("Error al cargar listas para ventas", err);
        }
    };

    const resetForm = () => {
        setFormData({ producto: "", cliente: "", cantidad: "", total: "" });
        setShowModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                producto: formData.producto,
                cliente: formData.cliente,
                cantidad: parseInt(formData.cantidad) || 0,
                total: parseFloat(formData.total) || 0,
            };
            await createVenta(payload);
            resetForm();
            setRefreshKey((k) => k + 1);
        } catch (err) {
            console.error("Error al crear venta", err);
        }
    };

    // recalc total whenever producto or cantidad change
    useEffect(() => {
        if (formData.producto && formData.cantidad) {
            const prod = productos.find((p) => p.id === formData.producto);
            const qty = parseInt(formData.cantidad) || 0;
            if (prod) {
                setFormData((f) => ({
                    ...f,
                    total: (prod.precio * qty).toFixed(2),
                }));
            }
        }
    }, [formData.producto, formData.cantidad, productos]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Registro de Ventas
                    </h2>
                    <p className="text-gray-600">
                        Historial y nuevas transacciones
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nueva Venta</span>
                </button>
            </div>

            <SimpleTable
                key={refreshKey}
                title="Ventas Registradas"
                description=""
                tableName="ventas"
                columns={[
                    {
                        key: "productos",
                        label: "Producto",
                        render: (value) => value?.nombre || "-",
                    },
                    {
                        key: "clientes",
                        label: "Cliente",
                        render: (value) => value?.nombre || "-",
                    },
                    {
                        key: "fecha",
                        label: "Fecha",
                        render: (value) =>
                            new Date(value).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            }),
                    },
                    { key: "cantidad", label: "Cantidad" },
                    {
                        key: "total",
                        label: "Total",
                        render: (value) => (
                            <span className="font-semibold text-green-600">
                                €
                                {Number(value).toLocaleString("es-ES", {
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        ),
                    },
                ]}
            />

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">
                                Nueva Venta
                            </h3>
                            <button
                                onClick={resetForm}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Cerrar formulario"
                                title="Cerrar"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Producto
                                </label>
                                <select
                                    required
                                    value={formData.producto}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            producto: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">
                                        Selecciona un producto
                                    </option>
                                    {productos.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombre} – €{p.precio}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cliente
                                </label>
                                <select
                                    required
                                    value={formData.cliente}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cliente: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">
                                        Selecciona un cliente
                                    </option>
                                    {clientes.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cantidad
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.cantidad}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cantidad: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total (€)
                                </label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    min="0"
                                    value={formData.total}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Guardar Venta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
