// src/pages/ProductoDetalle.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useCarrito } from "../contex/CarritoContext.tsx";
import { useProductos } from "../hooks/useproductos";
import type { Producto } from "../types/producto";

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos } = useProductos();
  const { agregarProducto } = useCarrito();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);

  // Buscar producto por id
  const producto = productos.find((p) => String(p.id) === id);
  if (!producto) return <p className="text-center mt-20">Producto no encontrado</p>;

  const precioFinal = producto.precioFinal ?? producto.precio;

  const formatPrice = (precio: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(precio);

  return (
    <main className="p-4">
      <div className="lg:max-w-6xl max-w-xl mx-auto">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div className="w-full lg:sticky top-0">
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-2 w-16 shrink-0">
                {(Array.isArray(producto.imagenUrl) ? producto.imagenUrl : [producto.imagenUrl])?.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={producto.nombre}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-[64/85] object-cover cursor-pointer border-2 rounded-md transition-all ${
                      selectedImage === img ? "border-indigo-500" : "border-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div className="flex-1">
                <img
                  src={selectedImage ?? (Array.isArray(producto.imagenUrl) ? producto.imagenUrl[0] : producto.imagenUrl)}
                  alt={producto.nombre}
                  className="w-full aspect-[548/712] object-cover rounded-md shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Información del producto */}
          <div className="w-full flex flex-col">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{producto.nombre}</h3>
            <p className="text-slate-500 mt-2 text-sm">{producto.descripcion}</p>

            <div className="flex items-center flex-wrap gap-4 mt-6">
              <h4 className="text-slate-900 text-2xl sm:text-3xl font-semibold">{formatPrice(precioFinal)}</h4>
              {precioFinal < producto.precio && (
                <p className="text-slate-500 text-lg line-through">{formatPrice(producto.precio)}</p>
              )}
            </div>

            {/* Selección de cantidad */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm font-medium">Cantidad:</span>
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  -
                </button>
                <span className="px-4 py-1">{cantidad}</span>
                <button
                  onClick={() => setCantidad((c) => c + 1)}
                  className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={() => agregarProducto({ ...producto, quantity: cantidad })}
                className="px-4 py-3 w-[45%] bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
              >
                Agregar al carrito
              </button>
              <button
                onClick={() => {
                  agregarProducto({ ...producto, quantity: cantidad });
                  navigate("/carrito");
                }}
                className="px-4 py-3 w-[45%] bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
              >
                Comprar ahora
              </button>
              <button className="px-4 py-3 w-full sm:w-[45%] bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-medium rounded-lg">
                Agregar a wishlist
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Detalles del producto</h3>
              <p className="text-sm text-slate-500 mt-2">{producto.descripcion}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
