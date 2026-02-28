import { useEffect, useState } from "react";
import { Proveedor, getProveedores, createProveedor } from "../lib/api";
import { Plus, Tag, X } from "lucide-react";
import SimpleTable from "./SimpleTable";

export default function ProvidersModule() {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        empresa: "",
        contacto: "",
        pais: "",
        categoria_suministro: "",
    });

    // Cargar datos al montar el componente
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getProveedores();
            setProveedores(data);
        } catch (error) {
            console.error("Error al cargar proveedores:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            empresa: "",
            contacto: "",
            pais: "",
            categoria_suministro: "",
        });
        setShowModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProveedor(formData);
            resetForm();
            loadData(); // Recargamos los datos desde la API en lugar de usar un refreshKey
        } catch (err) {
            console.error("Error al crear proveedor:", err);
        }
    };

    // Mostrar un indicador de carga mientras se obtienen los datos (igual que en Productos)
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Gestión de Proveedores
                    </h2>
                    <p className="text-gray-600">
                        Administra los proveedores de tecnología
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo Proveedor</span>
                </button>
            </div>

            <SimpleTable
                title="Lista de Proveedores"
                description=""
                data={proveedores} // <- AQUÍ PASAMOS LOS DATOS OBTENIDOS A LA TABLA
                tableName="proveedores"
                columns={[
                    { key: "empresa", label: "Empresa" },
                    { key: "contacto", label: "Contacto" },
                    { key: "pais", label: "País" },
                    {
                        key: "categoria_suministro",
                        label: "Categoría",
                        render: (value: string) => (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                                <Tag className="w-3 h-3 mr-1" />
                                {value}
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
                                Nuevo Proveedor
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
                                    Empresa
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.empresa}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            empresa: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contacto
                                </label>
                                <input
                                    type="text"
                                    value={formData.contacto}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            contacto: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    País
                                </label>
                                <input
                                    type="text"
                                    value={formData.pais}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            pais: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoría de suministro
                                </label>
                                <input
                                    type="text"
                                    value={formData.categoria_suministro}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            categoria_suministro:
                                                e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex justify-end pt-4 space-x-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
