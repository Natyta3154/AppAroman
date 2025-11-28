import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

import { useProductos } from "../hooks/useproductos";
import type { ProductoResumen, Producto } from "../types/producto";
import { useCarrito } from "../contex/CarritoContext.tsx";

export default function Productos() {
  const { productos, loading, page, hasMore, fetchProductos } = useProductos();

  const [cart, setCart] = useState<ProductoResumen[]>([]);
  const { agregarProducto } = useCarrito();
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filtroPrecioMin, setFiltroPrecioMin] = useState<number | null>(null);
  const [filtroPrecioMax, setFiltroPrecioMax] = useState<number | null>(null);
  const [filtroDestacado, setFiltroDestacado] = useState<boolean | null>(null);
  const [filtrosAtributos, setFiltrosAtributos] = useState<Record<string, string | null>>({});

  // Cargar carrito desde localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: ProductoResumen | Producto) => {
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
    agregarProducto(product as Producto);
  };

  const formatPrice = (precio: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(precio);

  // FILTRADO
  const productosFiltrados = productos.filter(p => {
    const catNombre = (p.categoriaNombre ?? "").trim().toLowerCase();
    const filtroCat = filtroCategoria?.trim().toLowerCase();

    if (filtroCat && catNombre !== filtroCat) return false;
    if (filtroPrecioMin !== null && p.precioFinal < filtroPrecioMin) return false;
    if (filtroPrecioMax !== null && p.precioFinal > filtroPrecioMax) return false;
    if (filtroDestacado !== null && p.destacado !== filtroDestacado) return false;

    for (const [atrib, val] of Object.entries(filtrosAtributos)) {
      if (val && !(p.atributos?.some(a => (a.nombre ?? "").toLowerCase() === atrib.toLowerCase() && a.valor === val))) {
        return false;
      }
    }

    return true;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-20 px-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
          🌸 Catálogo de Productos
        </h1>

        {/* FILTROS */}
        <div className="flex flex-wrap gap-4 mb-10 justify-center items-center">
          <select
            value={filtroCategoria || ""}
            onChange={(e) => setFiltroCategoria(e.target.value || null)}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none"
          >
            <option value="">Todas las Categorías</option>
            {["Sahumerios", "Difusores", "Velas"].map((cat) => (
              <option key={`fija-${cat}`} value={cat}>{cat}</option>
            ))}
            {Array.from(
              new Set(
                productos
                  .map((p) => p.categoriaNombre)
                  .filter((cat) => cat && !["Sahumerios", "Difusores", "Velas"].includes(cat))
              )
            ).map((cat) => (
              <option key={`dinamica-${cat}`} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Precio Mínimo"
            value={filtroPrecioMin ?? ""}
            onChange={(e) => setFiltroPrecioMin(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none w-32"
          />
          <input
            type="number"
            placeholder="Precio Máximo"
            value={filtroPrecioMax ?? ""}
            onChange={(e) => setFiltroPrecioMax(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none w-32"
          />
         {/* <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filtroDestacado ?? false}
              onChange={(e) => setFiltroDestacado(e.target.checked ? true : null)}
              className="w-4 h-4"
            />
            Destacados
          </label>*/}

          
          <button
            onClick={() => {
              setFiltroCategoria(null);
              setFiltrosAtributos({});
              setFiltroPrecioMin(null);
              setFiltroPrecioMax(null);
              setFiltroDestacado(null);
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {productosFiltrados.map((producto) => {
            // Buscar oferta activa
            const ofertaActiva = producto.ofertas?.find((oferta) => oferta.estado === true);

            // Usar precioConDescuento del producto en lugar de calcularlo
            const precioConDescuento = producto.precioConDescuento;

            return (
              <motion.div
                key={producto.id}
                whileHover={{ scale: 1.04, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-black rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                {/* Imagen */}
                <div className="relative overflow-hidden">
                  <img
                    src={producto.imagenUrl}
                    alt={producto.nombre}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Overlay detalle */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <Link
                      to={`/productos/${producto.id}`}
                      className="bg-white rounded-full p-3 shadow-lg hover:bg-yellow-500 hover:text-white text-black flex items-center gap-2 font-semibold"
                    >
                      <span className="text-xl">👁️</span>
                      Detalle
                    </Link>
                  </div>

                  {/* Badges */}
                  {producto.destacado && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      🌟 DESTACADO
                    </span>
                  )}

                  {ofertaActiva && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                      🔥{" "}
                      {ofertaActiva.tipoDescuento === "PORCENTAJE"
                        ? `${ofertaActiva.valorDescuento}% OFF`
                        : "OFERTA"}
                    </span>
                  )}
                </div>

                {/* Info del producto */}
                <div className="p-5 flex flex-col justify-between min-h-[180px]">
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-500 hover:text-indigo-600 transition-colors line-clamp-1">
                      <Link to={`/productos/${producto.id}`}>{producto.nombre}</Link>
                    </h3>
                    <p className="text-sm text-yellow-500 mt-3 line-clamp-3">
                      {producto.descripcion}
                    </p>
                  </div>

                  {/* Precios */}
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex flex-col">
                      {ofertaActiva ? (
                        <>
                          <p className="text-sm text-gray-400 line-through">
                            {formatPrice(producto.precio)}
                          </p>
                          <p className="text-2xl font-bold text-green-500 drop-shadow-sm">
                            {formatPrice(precioConDescuento)}
                          </p>
                          {ofertaActiva.fechaFin && (
                            <p className="text-xs text-gray-300 mt-1">
                              Hasta{" "}
                              {new Date(ofertaActiva.fechaFin).toLocaleDateString("es-AR")}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-yellow-600 drop-shadow-sm">
                          {formatPrice(producto.precio)}
                        </p>
                      )}
                    </div>

                    {/* Botón agregar */}
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
      </div>
    </main>
  );
}
