import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ProductosModule from "./components/ProductosModule";
import SimpleTable from "./components/SimpleTable";
import CategoriesModule from "./components/CategoriesModule";
import ProvidersModule from "./components/ProvidersModule";
import SalesModule from "./components/SalesModule";
import { CheckCircle, Tag } from "lucide-react";

function App() {
    const [activeSection, setActiveSection] = useState("dashboard");

    const renderSection = () => {
        switch (activeSection) {
            case "dashboard":
                return <Dashboard />;

            case "productos":
                return <ProductosModule />;

            case "categorias":
                return <CategoriesModule />;

            case "clientes":
                return (
                    <SimpleTable
                        title="Gestión de Clientes"
                        description="Administra la base de datos de clientes"
                        tableName="clientes"
                        columns={[
                            { key: "nombre", label: "Nombre Completo" },
                            { key: "email", label: "Email" },
                            { key: "telefono", label: "Teléfono" },
                            {
                                key: "ciudad",
                                label: "Ciudad",
                                render: (value) => (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                        {value}
                                    </span>
                                ),
                            },
                            {
                                key: "compras",
                                label: "Cant. Compras",
                                render: (value) => value || 0,
                            },
                            {
                                key: "totalGastado",
                                label: "Gastado (€)",
                                render: (value) =>
                                    `€${Number(value || 0).toLocaleString(
                                        "es-ES",
                                        {
                                            minimumFractionDigits: 2,
                                        },
                                    )}`,
                            },
                        ]}
                    />
                );

            case "ventas":
                return <SalesModule />;

            case "proveedores":
                return <ProvidersModule />;

            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
            />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderSection()}
            </main>
        </div>
    );
}

export default App;
