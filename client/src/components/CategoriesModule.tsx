import { useState } from "react";
import { Categoria, getCategorias, createCategoria } from "../lib/api";
import { Plus, CheckCircle, X } from "lucide-react";
import SimpleTable from "./SimpleTable";

export default function CategoriesModule() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        codigo: "",
        activa: true,
    });

    const resetForm = () => {
        setFormData({ nombre: "", descripcion: "", codigo: "", activa: true });
        setShowModal(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCategoria(formData);
            resetForm();
            setRefreshKey((k) => k + 1);
        } catch (err) {
            console.error("Error al crear categoría:", err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Gestión de Categorías
                    </h2>
                    <p className="text-gray-600">
                        Administra las categorías de productos
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nueva Categoría</span>
                </button>
            </div>

            <SimpleTable
                key={refreshKey}
                title="Lista de Categorías"
                description=""
                tableName="categorias"
                columns={[
                    { key: "nombre", label: "Nombre" },
                    { key: "codigo", label: "Código" },
                    { key: "descripcion", label: "Descripción" },
                    {
                        key: "activa",
                        label: "Estado",
                        render: (value) => (
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                    value
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {value ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Activo
                                    </>
                                ) : (
                                    "Inactivo"
                                )}
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
                                Nueva Categoría
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
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nombre: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Código
                                </label>
                                <input
                                    type="text"
                                    value={formData.codigo}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            codigo: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            descripcion: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    id="categoria-activa"
                                    type="checkbox"
                                    checked={formData.activa}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            activa: e.target.checked,
                                        })
                                    }
                                    className="h-4 w-4 text-green-600 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="categoria-activa"
                                    className="text-sm text-gray-700"
                                >
                                    Activa
                                </label>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
