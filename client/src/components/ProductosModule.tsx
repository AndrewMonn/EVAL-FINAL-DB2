import { useEffect, useState } from "react";
import {
    Producto,
    Categoria,
    getProductos,
    getCategorias,
    createProducto,
    updateProducto,
    deleteProducto,
} from "../lib/api";
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    DollarSign,
    Package,
    AlertCircle,
    X,
} from "lucide-react";

export default function ProductosModule() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [precioMin, setPrecioMin] = useState("");
    const [precioMax, setPrecioMax] = useState("");
    const [stockBajo, setStockBajo] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        categoria_id: "",
        precio: "",
        stock: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productosRes, categoriasRes] = await Promise.all([
                getProductos(),
                getCategorias(),
            ]);
            setProductos(productosRes);
            setCategorias(
                categoriasRes.filter((c) => (c as any).activa || c.activo),
            );
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const productData = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                categoria: formData.categoria_id,
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock),
            };

            if (editingProduct) {
                await updateProducto(editingProduct.id, productData);
            } else {
                await createProducto(productData);
            }

            resetForm();
            loadData();
        } catch (error) {
            console.error("Error al guardar producto:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            await deleteProducto(id);
            loadData();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };

    const handleEdit = (producto: Producto) => {
        setEditingProduct(producto);
        setFormData({
            nombre: producto.nombre,
            descripcion: producto.descripcion || "",
            categoria_id: producto.categoria_id || "",
            precio: producto.precio.toString(),
            stock: producto.stock.toString(),
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            nombre: "",
            descripcion: "",
            categoria_id: "",
            precio: "",
            stock: "",
        });
        setEditingProduct(null);
        setShowModal(false);
    };

    const filteredProductos = productos.filter((producto) => {
        const matchesSearch = producto.nombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesPrecioMin =
            !precioMin || producto.precio >= parseFloat(precioMin);
        const matchesPrecioMax =
            !precioMax || producto.precio <= parseFloat(precioMax);
        const matchesStockBajo = !stockBajo || producto.stock < 10;

        return (
            matchesSearch &&
            matchesPrecioMin &&
            matchesPrecioMax &&
            matchesStockBajo
        );
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Gestión de Productos
                    </h2>
                    <p className="text-gray-600">
                        Administra el inventario de productos tecnológicos
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo Producto</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Search className="w-5 h-5 mr-2 text-blue-600" />
                    Búsqueda Avanzada
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar por nombre
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Nombre del producto..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Precio mínimo (€)
                        </label>
                        <input
                            type="number"
                            value={precioMin}
                            onChange={(e) => setPrecioMin(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Precio máximo (€)
                        </label>
                        <input
                            type="number"
                            value={precioMax}
                            onChange={(e) => setPrecioMax(e.target.value)}
                            placeholder="9999.99"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={stockBajo}
                                onChange={(e) => setStockBajo(e.target.checked)}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Stock bajo (&lt; 10)
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Producto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Precio
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProductos.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p>No se encontraron productos</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProductos.map((producto) => (
                                    <tr
                                        key={producto.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {producto.nombre}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                                {producto.categorias?.nombre ||
                                                    "Sin categoría"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-gray-900 font-semibold">
                                                <DollarSign className="w-4 h-4 mr-1" />
                                                {producto.precio.toLocaleString(
                                                    "es-ES",
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    },
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Package className="w-4 h-4 mr-1 text-gray-400" />
                                                <span
                                                    className={`font-medium ${
                                                        producto.stock < 10
                                                            ? "text-red-600"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {producto.stock}
                                                </span>
                                                {producto.stock < 10 && (
                                                    <AlertCircle className="w-4 h-4 ml-2 text-red-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(producto)
                                                    }
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            producto.id,
                                                        )
                                                    }
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingProduct
                                    ? "Editar Producto"
                                    : "Nuevo Producto"}
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
                                    Nombre del Producto
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ej: MacBook Pro 16"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Descripción
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.descripcion}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            descripcion: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Breve descripción del producto"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoría
                                </label>
                                <select
                                    required
                                    value={formData.categoria_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            categoria_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    aria-label="Seleccionar categoría"
                                >
                                    <option value="">
                                        Selecciona una categoría
                                    </option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio (€)
                                </label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    min="0"
                                    value={formData.precio}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            precio: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.stock}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            stock: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editingProduct ? "Actualizar" : "Crear"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
