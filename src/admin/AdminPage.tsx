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
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-20 px-4 bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a]">

      {/* GRID RESPONSIVE */}
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">

        {/* --- SIDEBAR DESKTOP / TABS MOBILE --- */}
        <aside className="bg-gray-800 p-4 lg:p-6 pt-20 lg:pt-20
                          w-full lg:w-64 
                          flex lg:flex-col 
                          overflow-x-auto lg:overflow-visible 
                          whitespace-nowrap lg:whitespace-normal
                          border-b border-gray-700 lg:border-b-0 ">

          <h1 className="hidden lg:block text-2xl font-bold mb-6">
            Admin Panel
          </h1>

          {/* NAV: horizontal en mobile, vertical en desktop */}
          <nav className="flex lg:flex-col gap-2">
            {tabs.map((tab, idx) => (
              <button
                key={tab.name}
                className={`
                  px-4 py-2 rounded transition text-sm lg:text-base cursor-pointer
                  ${activeTab === idx ? "bg-indigo-600" : "hover:bg-gray-700"}
                `}
                onClick={() => setActiveTab(idx)}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* --- CONTENIDO --- */}
        <section className="flex-1 p-4 lg:p-6 overflow-auto">
          {tabs[activeTab].component}
        </section>
      </div>
    </main>
  );
}
