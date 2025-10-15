import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useProductos } from "../hooks/useproductos";
import type { Producto } from "../types/producto"; //
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCarrito } from "../contex/CarritoContext.tsx";

export default function Productos() {
  const { productos, loading, page, hasMore, fetchProductos } = useProductos();
  const [cart, setCart] = useState<Producto[]>([]);
  const { agregarProducto } = useCarrito();

  // Cargar carrito desde localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Producto) => {
    // Actualizamos estado local
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    // También agregamos al contexto global
    agregarProducto(product);
  };

  const formatPrice = (precio: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(precio);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-200 py-20 px-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center tracking-tight">
          🌸 Catálogo de Productos
        </h1>

        {loading && productos.length === 0 ? (
          <p className="text-gray-500 text-lg animate-pulse text-center">
            Cargando productos...
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {productos.map((producto) => {
                const precioOriginal = producto.precioFinal ?? producto.precio;
                const precioFinal = producto.precioFinal ?? producto.precio;

                return (
                  <motion.div
                    key={producto.id}
                    whileHover={{ scale: 1.04, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative bg-black rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />

                      {/* Overlay solo sobre la imagen */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <Link
                          to={`/productos/${producto.id}`}
                          className="bg-white rounded-full p-3 shadow-lg hover:bg-yellow-500 hover:text-white text-black flex items-center gap-2 font-semibold"
                        >
                          <span className="text-xl">👁️</span>
                          Detalle
                        </Link>
                      </div>

                      {producto.destacado && (
                        <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          🌟 DESTACADO
                        </span>
                      )}
                    </div>


                    <div className="p-5 flex flex-col justify-between min-h-[180px]">
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-500 hover:text-indigo-600 transition-colors line-clamp-1">
                          <Link to={`/productos/${producto.id}`}>{producto.nombre}</Link>
                        </h3>
                        <p className="text-sm text-yellow-500 mt-3 line-clamp-3">{producto.descripcion}</p>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <div className="flex flex-col">
                          {precioFinal < Number(precioOriginal) ? (
                            <>
                              <p className="text-sm text-gray-400 line-through">{formatPrice(Number(precioOriginal))}</p>
                              <p className="text-2xl font-bold text-indigo-600 drop-shadow-sm">{formatPrice(precioFinal)}</p>
                            </>
                          ) : (
                            <p className="text-2xl font-bold text-yellow-600 drop-shadow-sm">{formatPrice(precioFinal)}</p>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(producto)}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-500 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Agregar
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* BOTÓN CARGAR MÁS */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchProductos(page + 1)}
                  className="bg-yellow-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-yellow-500 shadow-md hover:shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "Cargar más"}
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
