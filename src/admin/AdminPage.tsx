// src/admin/AdminPage.tsx
import { useState } from "react";
import UsuariosTab from "./UsuariosTab";
import ProductosTab from "./ProductosTab";
import PedidosTab from "./PedidosTab";
import FraganciasTab from "./Fragancias";
import Categorias from "./Categoria";
import PostBlog from "./postBlog";
import CategoriaPost from "./CategoriaPost";
import Ofertas from "./OfertasTab";

const tabs = [
  { name: "Usuarios", component: <UsuariosTab /> },
  { name: "Productos", component: <ProductosTab /> },
  { name: "Pedidos", component: <PedidosTab /> },
  { name: "Fragancias", component: <FraganciasTab /> },
  { name: "Categorías", component: <Categorias /> },
  { name: "Posts del Blog", component: <PostBlog /> },
  { name: "Categorías de Posts", component: <CategoriaPost /> },
  { name: "Ofertas", component: <Ofertas /> },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100  to-gray-200 py-20 px-4  bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a]">

      <div className="flex min-h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-6 flex flex-col pt-20">
          <h1 className="text-2xl font-bold mb-6">Admin Panel </h1>
          <nav className="flex flex-col space-y-2">
            {tabs.map((tab, idx) => (
              <button
                key={tab.name}
                className={`text-left px-4 py-2 rounded hover:bg-gray-700 transition ${activeTab === idx ? "bg-indigo-600" : ""
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
    </main>
  );
}
