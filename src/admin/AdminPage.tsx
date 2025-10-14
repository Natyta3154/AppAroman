// src/admin/AdminPage.tsx
import { useState } from "react";
import UsuariosTab from "./UsuariosTab";
import ProductosTab from "./ProductosTab";
import PedidosTab from "./PedidosTab";

const tabs = [
  { name: "Usuarios", component: <UsuariosTab /> },
  { name: "Productos", component: <ProductosTab /> },
  { name: "Pedidos", component: <PedidosTab /> },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <nav className="flex flex-col space-y-2">
          {tabs.map((tab, idx) => (
            <button
              key={tab.name}
              className={`text-left px-4 py-2 rounded hover:bg-gray-700 transition ${
                activeTab === idx ? "bg-indigo-600" : ""
              }`}
              onClick={() => setActiveTab(idx)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-6 overflow-auto">
        {tabs[activeTab].component}
      </main>
    </div>
  );
}
