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
  { name: "Quienes Somos", href: "/quienes-somos" },
  { name: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { carrito, toggleCart } = useCarrito();


  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-yellow-600 shadow-xl">
      <nav className="flex items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Tu Empresa</span>
            <img
              alt="Logo"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Navegación principal */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} className="text-sm/6 font-semibold text-white hover:text-gray-300">
              {item.name}
            </Link>
          ))}
        </div>

        {/* Área de usuario + carrito */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-6 relative">
          {/* 🔹 Ícono del carrito */}
          <Link to="/carrito" className="relative">
            <ShoppingCartIcon className="h-6 w-6 text-white hover:text-gray-300 transition" />
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
                className="text-white font-semibold px-4 py-2 bg-gray-700 rounded-lg"
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
                  <li>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-white hover:bg-gray-700">
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-sm/6 font-semibold text-white hover:text-gray-300">
              Log in &rarr;
            </Link>
          )}
        </div>

        {/* Botón mobile */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200"
          >
            <span className="sr-only">Abrir menú principal</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <img
                alt="Logo"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-200"
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
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                  >
                    {item.name}
                  </Link>
                ))}
                {/* 🔹 Ícono carrito en móvil */}
                <nav className="bg-gray-900 p-4 flex justify-between items-center">
                  <Link to="/" className="text-white text-lg font-bold">Mi Tienda</Link>

                  <button onClick={toggleCart} className="relative">
                    <ShoppingCartIcon className="h-6 w-6 text-white hover:text-gray-300 transition" />
                    {carrito.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-xs font-bold text-white rounded-full h-4 w-4 flex items-center justify-center">
                        {carrito.length}
                      </span>
                    )}
                  </button>
                </nav>

              </div>

              <div className="py-6">
                {user ? (
                  <>
                    <Link
                      to="/perfil"
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                    >
                      Editar Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="-mx-3 block w-full rounded-lg px-3 py-2 text-left text-base/7 font-semibold text-white hover:bg-white/5"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
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
