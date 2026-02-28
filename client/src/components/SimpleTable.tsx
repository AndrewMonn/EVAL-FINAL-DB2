import { useEffect, useState } from "react";
import {
    getCategorias,
    getClientes,
    getProductos,
    getProveedores,
    getVentas,
} from "../lib/api";
import { AlertCircle } from "lucide-react";

interface SimpleTableProps {
    title: string;
    description: string;
    tableName: string;
    columns: {
        key: string;
        label: string;
        render?: (value: any, row: any) => React.ReactNode;
    }[];
}

export default function SimpleTable({
    title,
    description,
    tableName,
    columns,
}: SimpleTableProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [tableName]);

    const loadData = async () => {
        try {
            setLoading(true);
            let result: any[] = [];

            switch (tableName) {
                case "categorias":
                    result = await getCategorias();
                    break;
                case "clientes":
                    result = await getClientes();
                    break;
                case "productos":
                    result = await getProductos();
                    break;
                case "proveedores":
                    result = await getProveedores();
                    break;
                case "ventas":
                    result = await getVentas();
                    break;
                default:
                    // fallback - attempt raw fetch
                    result = [];
            }

            setData(result);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setLoading(false);
        }
    };

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
                    {title}
                </h2>
                <p className="text-gray-600">{description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p>No se encontraron registros</p>
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className="px-6 py-4"
                                            >
                                                {col.render
                                                    ? col.render(
                                                          row[col.key],
                                                          row,
                                                      )
                                                    : row[col.key] || "-"}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
