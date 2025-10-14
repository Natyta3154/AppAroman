import { useState, useEffect } from "react";
import { useOfertas, type ProductoOferta } from "../../hooks/useOfertas";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface OffersCarouselProps {
  limite?: number; // cantidad máxima de ofertas a mostrar
}

export default function OffersCarousel({ limite = 5 }: OffersCarouselProps) {
  const { ofertas, cargando, error } = useOfertas(limite);
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % ofertas.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + ofertas.length) % ofertas.length);

  // ⏱️ auto-slide cada 6 segundos
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [ofertas]);

  if (cargando)
    return <p className="text-center mt-4 animate-pulse text-gray-500">Cargando ofertas...</p>;

  if (error)
    return <p className="text-center mt-4 text-red-500 font-semibold">{error}</p>;

  if (ofertas.length === 0)
    return <p className="text-center mt-4 text-gray-400">No hay ofertas disponibles.</p>;

  const currentOffer: ProductoOferta = ofertas[current];

  return (
    <div className="relative w-full sm:w-[90%] md:w-[80%] h-[45vh] sm:h-[55vh] md:h-[60vh] mx-auto mt-10 overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900 to-black">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentOffer.id}
          src={currentOffer.imagenUrl || "https://via.placeholder.com/600x300?text=Oferta+Especial"}
          alt={currentOffer.nombre}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Gradiente con info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
        <motion.div
          key={currentOffer.id + "-info"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white drop-shadow-md">
            {currentOffer.nombre}
          </h2>
          <p className="text-lg mt-1">
            <span className="line-through text-gray-300 mr-3">
              ${currentOffer.precioOriginal}
            </span>
            <span className="text-yellow-400 font-semibold text-2xl">
              ${currentOffer.precioConDescuento}
            </span>
          </p>
        </motion.div>
      </div>

      {/* Botones de navegación */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/70 transition"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {ofertas.map((_, index) => (
          <span
            key={index}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              index === current ? "bg-yellow-400 scale-125" : "bg-gray-500"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
