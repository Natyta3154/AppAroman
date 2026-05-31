import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext.tsx";
import { useProductoDetalle } from "../hooks/useProductoDetalle.ts";
import { useProductosRelacionados } from "../hooks/useProductosRelacionados.ts";
import type { Producto } from "../types/producto";
import { ShoppingBag, Heart, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";



//import type { Producto } from "../types/producto";






export default function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarProducto } = useCarrito();

  const { producto, loading, error } = useProductoDetalle(id);
  const { productos: relacionados, loading: loadingRelacionados } =
    useProductosRelacionados(producto?.id, producto?.id);

  // Scroll al top cuando cambia el ID del producto
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [selectedFragancia, setSelectedFragancia] = useState<string>("");

 if (loading)
  return (
    <main className="bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-20 px-4">
      <section className="max-w-7xl mx-auto px-5 sm:px-10 md:px-16 py-16">

        {/* Título del loader */}
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-white/40 rounded-xl mx-auto animate-pulse"></div>
          <div className="h-4 w-80 bg-white/30 rounded-xl mx-auto mt-4 animate-pulse"></div>
        </div>

        {/* Skeleton principal producto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Imagen grande */}
          <div className="bg-white/40 rounded-3xl shadow-lg p-4 animate-pulse">
            <div className="w-full h-[500px] bg-white/30 rounded-xl"></div>
          </div>

          {/* Info del producto */}
          <div className="bg-white/40 rounded-3xl shadow-lg p-8 space-y-6 animate-pulse">
            <div className="h-8 w-3/4 bg-white/50 rounded"></div>
            <div className="h-4 w-full bg-white/40 rounded"></div>
            <div className="h-4 w-5/6 bg-white/40 rounded"></div>
            <div className="h-4 w-2/3 bg-white/40 rounded"></div>

            {/* precio */}
            <div className="h-10 w-40 bg-white/60 rounded"></div>

            {/* select fragancia */}
            <div className="h-12 w-full bg-white/40 rounded"></div>

            {/* cantidad */}
            <div className="h-12 w-48 bg-white/40 rounded"></div>

            {/* total */}
            <div className="h-6 w-40 bg-white/50 rounded"></div>

            {/* botones */}
            <div className="flex gap-4">
              <div className="h-12 w-40 bg-white/50 rounded-lg"></div>
              <div className="h-12 w-40 bg-white/50 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* productos relacionados loader */}
        <h2 className="text-2xl font-bold text-white mt-20 mb-6 animate-pulse">
          Productos relacionados
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, ].map((i) => (
            <div
              key={i}
              className="bg-white/40 rounded-xl shadow-md animate-pulse p-4"
            >
              <div className="w-full h-40 bg-white/30 rounded-md"></div>
              <div className="h-4 w-3/4 bg-white/50 rounded mt-4"></div>
              <div className="h-4 w-1/2 bg-white/40 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );

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
    <main className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* CONTENEDOR PRINCIPAL DEL PRODUCTO */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 p-6 sm:p-10 lg:p-12">
            
            {/* 📸 GALERÍA */}
            <div className="w-full lg:sticky top-10 flex flex-col-reverse sm:flex-row gap-4">
              {/* Miniaturas */}
              <div className="flex sm:flex-col gap-3 w-full sm:w-20 shrink-0 overflow-x-auto sm:overflow-visible py-2 sm:py-0">
                {[producto.imagenUrl].map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={producto.nombre}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square sm:aspect-[3/4] object-cover cursor-pointer rounded-xl transition-all duration-300 ${
                      selectedImage === img
                        ? "ring-2 ring-yellow-500 ring-offset-2 scale-105"
                        : "border border-gray-200 hover:border-yellow-400 opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
              
              {/* Imagen Principal */}
              <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-50 aspect-square sm:aspect-[4/5] flex items-center justify-center">
                <img
                  src={selectedImage ?? producto.imagenUrl}
                  alt={producto.nombre}
                  className="w-full h-full object-cover shadow-sm transition-transform duration-500 hover:scale-105"
                />
                {/* Badge Oferta si aplica */}
                {precioFinal < producto.precio && (
                  <span className="absolute top-4 right-4 bg-red-600 text-white font-bold px-4 py-1.5 rounded-full shadow-lg text-sm">
                    OFERTA
                  </span>
                )}
              </div>
            </div>

            {/* 🧾 INFORMACIÓN DEL PRODUCTO */}
            <div className="w-full flex flex-col py-6 lg:py-0">
              <span className="text-yellow-600 font-bold tracking-wider text-sm uppercase mb-2">
                Aromanza Premium
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                {producto.nombre}
              </h1>
              
              {/* Línea divisoria suave */}
              <div className="w-16 h-1 bg-yellow-500 rounded-full mt-6 mb-6"></div>
              
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {producto.descripcion}
              </p>

            {/* 💰 PRECIO */}
            <div className="flex items-baseline flex-wrap gap-4 mt-8">
              <h2 className="text-4xl font-extrabold text-gray-900">
                {formatPrice(precioFinal)}
              </h2>
              {precioFinal < producto.precio && (
                <p className="text-gray-400 text-xl font-medium line-through">
                  {formatPrice(producto.precio)}
                </p>
              )}
            </div>

            {/* 🧴 FRAGANCIAS */}
            {producto.fragancias && producto.fragancias.length > 0 && (
              <div className="mt-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Selecciona una Fragancia:
                </label>
                <div className="relative">
                  <select
                    value={selectedFragancia}
                    onChange={(e) => setSelectedFragancia(e.target.value)}
                    className="appearance-none border-2 border-gray-200 rounded-xl px-5 py-3.5 w-full bg-white text-gray-800 font-medium hover:border-yellow-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all shadow-sm"
                  >
                    <option value="" disabled>✨ Elegir aroma...</option>
                    {producto.fragancias.map((frag, i) => (
                      <option key={i} value={frag}>
                        {frag}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-500">
                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            )}

            {/* 📦 STOCK Y CANTIDAD */}
            <div className="mt-8 flex flex-wrap items-end gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Cantidad:
                </label>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm h-[52px]">
                  <button
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    className="px-5 h-full text-xl text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                    disabled={cantidad <= 1}
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{cantidad}</span>
                  <button
                    onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
                    className="px-5 h-full text-xl text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                    disabled={cantidad >= producto.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {producto.stock > 0 ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Stock disponible ({producto.stock})</span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">AGOTADO</span>
                )}
              </div>
            </div>

            {/* 💵 TOTAL */}
            <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Subtotal a pagar:</span>
              <span className="text-2xl font-black text-gray-900">
                {formatPrice(total)}
              </span>
            </div>

            {/* 🛒 BOTONES */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAgregarCarrito}
                className="flex-1 py-4 px-6 bg-white border-2 border-yellow-500 text-yellow-600 font-bold rounded-xl hover:bg-yellow-50 hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Agregar al Carrito
              </button>
              <button
                onClick={() => {
                  handleAgregarCarrito();
                  navigate("/carrito");
                }}
                className="flex-1 py-4 px-6 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 hover:shadow-lg transition-all shadow-yellow-500/30"
              >
                Comprar Ahora
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
      <section className="mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            También te podría gustar
          </h2>
        </div>

        {loadingRelacionados ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : relacionados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relacionados.map((rel: Producto, index: number) => {
              const relOfertaActiva = rel.ofertas?.find((o: any) => o.estado === true);
              const relPrecioConDescuento = rel.precioConDescuento;

              return (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
                  className="relative bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col"
                >
                  {/* Imagen del Producto Relacionado */}
                  <div className="relative overflow-hidden h-60 bg-gray-50">
                    <img
                      src={rel.imagenUrl}
                      alt={rel.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Overlay al hacer hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <button
                        onClick={() => navigate(`/productos/${rel.id}`)}
                        className="bg-white rounded-full px-5 py-2.5 shadow-xl hover:bg-yellow-500 hover:text-black text-gray-900 font-bold transition-all transform translate-y-4 group-hover:translate-y-0"
                      >
                        Ver Detalle
                      </button>
                    </div>

                    <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors z-10">
                      <Heart className="w-5 h-5" />
                    </button>

                    {/* Badges Relacionados */}
                    {rel.destacado && (
                      <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                        🌟 Premium
                      </span>
                    )}

                    {relOfertaActiva && (
                      <span className="absolute bottom-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-tr-xl shadow-md z-10">
                        {relOfertaActiva.tipoDescuento === "PORCENTAJE"
                          ? `${relOfertaActiva.valorDescuento}% OFF`
                          : "OFERTA"}
                      </span>
                    )}
                  </div>

                  {/* Info del Producto Relacionado */}
                  <div className="p-5 flex flex-col flex-grow justify-between bg-white z-20">
                    <div onClick={() => navigate(`/productos/${rel.id}`)} className="cursor-pointer">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-yellow-600 transition-colors">
                        {rel.nombre}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {rel.descripcion}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex flex-col">
                        {relOfertaActiva ? (
                          <>
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(rel.precio)}
                            </p>
                            <p className="text-xl font-extrabold text-green-600">
                              {formatPrice(relPrecioConDescuento || rel.precio)}
                            </p>
                          </>
                        ) : (
                          <p className="text-xl font-extrabold text-gray-900">
                            {formatPrice(rel.precio)}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          agregarProducto(rel as any);
                        }}
                        className="bg-gray-100 text-gray-900 p-3 rounded-xl hover:bg-yellow-500 hover:text-black hover:shadow-lg transition-all"
                        title="Agregar al carrito"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">No hay productos relacionados disponibles.</p>
          </div>
        )}
      </section>
      </motion.div>

    </main>
  );
}
