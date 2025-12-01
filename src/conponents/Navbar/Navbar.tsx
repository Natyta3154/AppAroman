'use client'
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import { useCarrito } from "../../contex/CarritoContext.tsx";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Productos", href: "/productos" },
  { name: "Ofertas", href: "/ofertas" },
  { name: "Blog", href: "/blog" },
  { name: "Quienes Somos", href: "/quienes-somos" },
  { name: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { carrito } = useCarrito();


  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-yellow-600 shadow-xl">
      <nav className="flex items-center justify-between p-6 lg:px-8">
        {/* Logo + Nombre */}
        <div className="flex items-center lg:flex-1">
          <Link to="/" className="flex items-center gap-2 -m-1.5 p-1.5">
            <img
              alt="Logo"
              src="/rev.png"
              className="h-8 w-auto"
            />
            <span className="text-xl font-semibold text-black tracking-wide">
              Aromanza
            </span>
          </Link>
        </div>


        {/* Navegación principal */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} className="text-sm/6 font-semibold text-black hover:text-gray-300">
              {item.name}

            </Link>
          ))}
        </div>

        {/* Área de usuario + carrito */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-6 relative">
          {/* 🔹 Ícono del carrito */}
          <Link to="/carrito" className="relative">
            <ShoppingCartIcon className="h-6 w-6 font-semibold text-black hover:text-gray-300 transition" />
            {/* Burbuja opcional */}
            <span className="absolute -top-2 -right-2 bg-red-600 text-xs font-bold text-white rounded-full h-4 w-4 flex items-center justify-center">
              {carrito.length}
            </span>
          </Link>

          {/* 🔹 Usuario */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="font-semibold text-black px-4 py-2 bg-gray-700 rounded-lg"
              >
                {user.nombre}
              </button>

              {menuOpen && (
                <ul className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                  <li>
                    <Link to="/perfil" className="block px-4 py-2 text-white hover:bg-gray-700">
                      Editar Perfil
                    </Link>
                  </li>

                  {/* 🔹 Solo para admins */}
                  {user.rol === "ADMIN" && (
                    <li>
                      <Link to="/admin" className="block px-4 py-2 text-white hover:bg-gray-700">
                        Panel Admin
                      </Link>
                    </li>
                  )}

                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-block px-5 py-2 font-semibold text-black text-sm rounded-lg bg-yellow-500 hover:bg-yellow-600 shadow-md hover:shadow-lg transition-all duration-300"
            >
              Iniciar Sesión
            </Link>

          )}

        </div>

        {/* Botón mobile */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-primario"
          >
            <span className="sr-only">Abrir menú principal</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
    <div className="fixed inset-0 z-50" />
    <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black/50 backdrop-blur-md p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
      <div className="flex items-center justify-between">
        <Link to="/" className="-m-1.5 p-1.5">
          <img
            alt="Logo"
            src="./rev.png"
            className="h-8 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="-m-2.5 rounded-md p-2.5 text-black-200"
        >
          <span className="sr-only">Cerrar menú</span>
          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-6 flow-root">
        <div className="-my-6 divide-y divide-white/10">
          <div className="space-y-2 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-black hover:bg-white/5"
              >
                {item.name}
              </Link>
            ))}

            {/* ======================================================
                 MODIFICACIÓN: Carrito de compras (para que se vea igual) 
                 ====================================================== */}
            <Link
              to="/carrito"
              onClick={() => setMobileMenuOpen(false)}
              className="-mx-3 flex justify-between items-center rounded-lg px-3 py-2 text-base/7 font-semibold text-black hover:bg-white/5"
            >
              <span>Carrito</span>
              <div className="relative">
                <ShoppingCartIcon className="h-6 w-6 text-black" />
                {carrito.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-xs font-bold text-white rounded-full h-4 w-4 flex items-center justify-center">
                    {carrito.length}
                  </span>
                )}
              </div>
            </Link>
          </div>
          
          {/* SECCIÓN DE AUTENTICACIÓN (LOGIN/PERFIL) */}
          <div className="py-6">
            {user ? (
              <>
                <Link
                  to="/perfil"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-black hover:bg-white/5"
                >
                  Editar Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="-mx-3 block w-full rounded-lg px-3 py-2 text-left text-base/7 font-semibold text-black hover:bg-white/5"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-black hover:bg-white/5"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </Dialog.Panel>
</Dialog>
    </header>
  );
}
