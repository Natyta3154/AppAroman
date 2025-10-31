import { useState, useEffect } from "react";
import { useOfertas, } from "../../hooks/useOfertas";
import { motion, AnimatePresence } from "framer-motion";
import type { Oferta } from "../../types/producto";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface OffersCarouselProps {
  limite?: number;
}

export default function OffersCarousel({ limite = 5 }: OffersCarouselProps) {
 const { ofertas, cargando, error } = useOfertas(limite, "carrusel");

  const [current, setCurrent] = useState(0);

  // Funciones de navegación
  const nextSlide = () => setCurrent((prev) => (prev + 1) % ofertas.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + ofertas.length) % ofertas.length);

  // Auto-slide
  useEffect(() => {
    if (!ofertas.length) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [ofertas]);

  // Estados de carga / error
  if (cargando) return <p className="text-center mt-4 animate-pulse text-gray-500">Cargando ofertas...</p>;
  if (error) return <p className="text-center mt-4 text-red-500 font-semibold">{error}</p>;
  if (!ofertas || ofertas.length === 0)
    return <p className="text-center mt-4 text-gray-400">No hay ofertas disponibles.</p>;

  const currentOffer: Oferta | undefined = ofertas[current];
  if (!currentOffer)
    return <p className="text-center mt-4 text-gray-400">Cargando oferta actual...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-20 px-4 flex-col justify-center items-center">
      {/* Texto introductorio */}
      <div className="mt-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Descubre nuestras ofertas exclusivas
        </h2>
        <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
          Cada semana seleccionamos los productos más destacados para ofrecerte promociones
          únicas y oportunidades imperdibles. ¡No dejes pasar estas ofertas!
        </p>
      </div>

      {/* Carrusel principal */}
      <div className="relative w-full sm:w-[90%] md:w-[80%] h-[50vh] sm:h-[60vh] md:h-[65vh] mx-auto mt-12 overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-400 border-4 border-white/20">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentOffer.idOferta}
            src={currentOffer.imagenUrl || "https://via.placeholder.com/600x300?text=Oferta+Especial"}
            alt={currentOffer.nombreProducto || "Oferta especial"}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full object-cover rounded-3xl"
          />
        </AnimatePresence>

        {/* Overlay con info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 rounded-3xl">
          <motion.div
            key={`${currentOffer.idOferta}-info`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">
              {currentOffer.nombreProducto}
            </h2>
            <p className="text-xl mt-2 flex items-center gap-3">
  <span className="line-through text-gray-300">
    ${currentOffer.precio.toFixed(2)}
  </span>
  <span className="text-yellow-300 font-bold text-2xl">
    ${currentOffer.precioConDescuento.toFixed(2)}
  </span>
</p>

          </motion.div>
        </div>

        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/70 transition"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Indicadores inferiores */}
        <div className="absolute bottom-4 w-full flex justify-center gap-2">
          {ofertas.map((producto, index) => (
            <div
              key={producto.productoId ?? index}
              onClick={() => setCurrent(index)}
              className={`cursor-pointer transition-transform ${
                current === index ? "scale-110" : "opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={producto.imagenUrl || "https://via.placeholder.com/100x100?text=Oferta"}
                alt={producto.nombreProducto || "Sin nombre"}
                className="w-16 h-16 object-cover rounded-full border-2 border-white"
              />
              <p className="text-white text-xs mt-1 truncate w-16 text-center">
                {producto.nombreProducto || "Sin nombre"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
