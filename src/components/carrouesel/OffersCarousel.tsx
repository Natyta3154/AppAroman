import { useState, useEffect } from "react";
import { useOfertas } from "../../hooks/useOfertas";
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

  const currentOffer: Oferta | undefined = ofertas[current];

  if (!cargando && !error && (!ofertas || ofertas.length === 0)) {
    return null;
  }

  return (
    <main className="bg-gradient-to-b from-gray-900 to-brand-primary py-20 px-4 flex flex-col justify-center items-center transition-all duration-300">
      {/* Texto introductorio (siempre visible) */}
      <div className="mt-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow-md">
          Descubre nuestras ofertas exclusivas
        </h2>
        <p className="text-lg text-white/70 mb-6 max-w-3xl mx-auto">
          Cada semana seleccionamos los productos más destacados para ofrecerte promociones
          únicas y oportunidades imperdibles. ¡No dejes pasar estas ofertas!
        </p>
      </div>

      {/* Contenido dinámico */}
      {cargando ? (
        // 🔸 Skeleton de carga
        <div className="relative w-full sm:w-[90%] md:w-[80%] h-[60vh] mx-auto mt-12 rounded-3xl bg-white/10 backdrop-blur-md animate-pulse shadow-inner flex items-center justify-center text-white/50 font-semibold border border-white/20">
          Cargando ofertas...
        </div>
      ) : error ? (
        // 🔸 Error
        <p className="text-center mt-8 text-red-400 font-semibold">{error}</p>
      ) : (
        // 🔸 Carrusel real
        <div className="relative w-full sm:w-[90%] md:w-[80%] h-[50vh] sm:h-[60vh] md:h-[65vh] mx-auto mt-12 overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-400 border border-white/20">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentOffer?.idOferta}
              src={currentOffer?.imagenUrl || "https://via.placeholder.com/600x300?text=Oferta+Especial"}
              alt={currentOffer?.nombreProducto || "Oferta especial"}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover rounded-3xl"
            />
          </AnimatePresence>

          {/* Overlay con info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 rounded-3xl">
            <motion.div
              key={`${currentOffer?.idOferta}-info`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">
                {currentOffer?.nombreProducto}
              </h2>
              <p className="text-xl mt-2 flex items-center gap-3">
                <span className="line-through text-red-400">
                  ${currentOffer?.precio.toFixed(2)}
                </span>
                <span className="text-white font-bold text-3xl drop-shadow-md">
                  ${currentOffer?.precioConDescuento.toFixed(2)}
                </span>
              </p>
            </motion.div>
          </div>

          {/* Botones de navegación */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/60 border border-white/20 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/60 border border-white/20 transition"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* Indicadores inferiores */}
          <div className="absolute bottom-4 w-full flex justify-center gap-3">
            {ofertas.map((producto, index) => (
              <div
                key={producto.productoId ?? index}
                onClick={() => setCurrent(index)}
                className={`cursor-pointer transition-all duration-300 ${
                  current === index ? "scale-110 opacity-100 ring-2 ring-white" : "opacity-50 hover:opacity-100"
                } rounded-full`}
              >
                <img
                  src={producto.imagenUrl || "https://via.placeholder.com/100x100?text=Oferta"}
                  alt={producto.nombreProducto || "Sin nombre"}
                  className="w-14 h-14 object-cover rounded-full border border-white/50"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
