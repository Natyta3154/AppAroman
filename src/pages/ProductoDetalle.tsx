import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCarrito } from "../contex/CarritoContext.tsx";
import { useProductoDetalle } from "../hooks/useProductoDetalle.ts";
import { useProductosRelacionados } from "../hooks/useProductosRelacionados.ts";
import type { Producto } from "../types/producto";



//import type { Producto } from "../types/producto";

export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarProducto } = useCarrito();

  const { producto, loading, error } = useProductoDetalle(id);
  const { productos: relacionados, loading: loadingRelacionados } =
    useProductosRelacionados(producto?.id, producto?.id);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [selectedFragancia, setSelectedFragancia] = useState<string>("");

  if (loading) return <p className="text-center mt-20">Cargando producto...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!producto) return <p className="text-center mt-20">Producto no encontrado</p>;

  // 💰 Calculamos el precio final y total dinámico
  const precioFinal = producto.precioFinal ?? producto.precio;
  const total = precioFinal * cantidad;

  // 🧮 Helper para formatear precios
  const formatPrice = (precio: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(precio);

  // 🧴 Función para agregar al carrito con validaciones
  const handleAgregarCarrito = () => {
    if (producto.fragancias?.length && !selectedFragancia) {
      alert("Por favor, seleccioná una fragancia antes de continuar 🪔");
      return;
    }

    agregarProducto({
      ...producto,
      quantity: cantidad,
      fragancias: selectedFragancia ? [selectedFragancia] : [],
    });
  };

  return (
        <main className="min-h-screen bg-gradient-to-b from-gray-100  to-gray-200 py-20 px-4  bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a]">

      <div className="lg:max-w-6xl max-w-xl mx-auto">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8 mt-30">
          {/* 📸 GALERÍA */}
          <div className="w-full lg:sticky top-0">
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-2 w-16 shrink-0">
                {[producto.imagenUrl].map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={producto.nombre}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-[64/85] object-cover cursor-pointer border-2 rounded-md transition-all ${selectedImage === img
                        ? "border-indigo-500"
                        : "border-gray-200"
                      }`}
                  />
                ))}
              </div>
              <div className="flex-1">
                <img
                  src={selectedImage ?? producto.imagenUrl}
                  alt={producto.nombre}
                  className="w-full aspect-[548/712] object-cover rounded-md shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* 🧾 INFORMACIÓN DEL PRODUCTO */}
          <div className="w-full flex flex-col">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
              {producto.nombre}
            </h3>
            <p className="text-slate-500 mt-2 text-sm">{producto.descripcion}</p>

            {/* 💰 PRECIO */}
            <div className="flex items-center flex-wrap gap-4 mt-6">
              <h4 className="text-slate-900 text-2xl sm:text-3xl font-semibold">
                {formatPrice(precioFinal)}
              </h4>
              {precioFinal < producto.precio && (
                <p className="text-slate-500 text-lg line-through">
                  {formatPrice(producto.precio)}
                </p>
              )}
            </div>

            {/* 🧴 FRAGANCIAS */}
            {producto.fragancias && producto.fragancias.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  Fragancia:
                </label>
                <select
                  value={selectedFragancia}
                  onChange={(e) => setSelectedFragancia(e.target.value)}
                  className="border rounded-lg px-4 py-2 w-full bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Seleccionar fragancia</option>
                  {producto.fragancias.map((frag, i) => (
                    <option key={i} value={frag}>
                      {frag}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 📦 STOCK */}
            <div className="mt-4 text-sm text-gray-700">
              <strong>Stock disponible:</strong>{" "}
              {producto.stock > 0 ? (
                <span className="text-green-600">
                  {producto.stock} unidades
                </span>
              ) : (
                <span className="text-red-500">Agotado</span>
              )}
            </div>

            {/* 🔢 CANTIDAD */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm font-medium">Cantidad:</span>
              <div className="flex items-center border rounded-md overflow-hidden">
                <button
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200 transition"
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1">{cantidad}</span>
                <button
                  onClick={() =>
                    setCantidad((c) => Math.min(producto.stock, c + 1))
                  }
                  className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200 transition"
                  disabled={cantidad >= producto.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* 💵 TOTAL */}
            <div className="mt-4 text-md text-gray-800">
              <strong>Total: </strong>
              <span className="text-indigo-600 font-semibold">
                {formatPrice(total)}
              </span>
            </div>

            {/* 🛒 BOTONES */}
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={handleAgregarCarrito}
                className="px-4 py-3 w-[45%] bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
              >
                Agregar al carrito
              </button>
              <button
                onClick={() => {
                  handleAgregarCarrito();
                  navigate("/carrito");
                }}
                className="px-4 py-3 w-[45%] bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
              >
                Comprar ahora
              </button>
            </div>

            {/* ⚙️ ATRIBUTOS */}
            {producto.atributos?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Características
                </h3>
                <ul className="mt-2 text-sm text-slate-600 list-disc ml-6">
                  {producto.atributos.map((a, i) => (
                    <li key={i}>
                      <strong>{a.nombre}:</strong> {a.valor}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* 🪔 Productos Relacionados */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Productos relacionados
        </h2>

        {loadingRelacionados ? (
          <p>Cargando productos relacionados...</p>
        ) : relacionados.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {relacionados.map((rel: Producto) => (
              <div
                key={rel.categoriaId}
                onClick={() => navigate(`/producto/${rel.id}`)}
                className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={rel.imagenUrl}
                  alt={rel.nombre}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-slate-900">{rel.nombre}</h3>
                  <p className="text-indigo-600 font-medium mt-1">
                    ${rel.precioFinal ?? rel.precio}
                  </p>
                </div>
              </div>
            ))}

          </div>
        ) : (
          <p className="text-gray-500">No hay productos relacionados disponibles.</p>
        )}
      </section>

    </main>
  );
}
