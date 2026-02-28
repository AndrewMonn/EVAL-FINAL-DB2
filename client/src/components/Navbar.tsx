import { Package2, LayoutDashboard, Package, Users, ShoppingCart, Truck } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Navbar({ activeSection, onSectionChange }: NavbarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'categorias', label: 'Categorías', icon: Package2 },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
    { id: 'proveedores', label: 'Proveedores', icon: Truck },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Package2 className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Tech-Inventory Pro</h1>
              <p className="text-xs text-blue-100">Sistema de Gestión Tecnológica</p>
            </div>
          </div>

          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    activeSection === item.id
                      ? 'bg-white text-blue-700 font-semibold shadow-md'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
