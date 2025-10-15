
import { motion } from "framer-motion";
import { type ProductoOferta} from "../types/producto";
import { useOfertas } from "../hooks/useOfertas";
import { ShoppingBag } from "lucide-react";

export default function Ofertas() {
  const { ofertas, cargando } = useOfertas();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-4xl text-rose-500"
        >
          🛍️
        </motion.div>
      </div>
    );
  }

  if (ofertas.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
        <p className="text-lg">No hay ofertas activas por el momento 😢</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-16 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-10 text-gray-800"
      >
        🔥 Ofertas Especiales de la Semana 🔥
      </motion.h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        {ofertas.map((oferta: ProductoOferta, i: number) => (
          <motion.div
            key={oferta.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="relative">
              <img
                src={oferta.imagenUrl}
                alt={oferta.nombre}
                className="w-full h-60 object-cover"
              />
              <div className="absolute top-2 right-2 bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{oferta.precioConDescuento}%
              </div>
            </div>

            <div className="p-5 text-center">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{oferta.nombre}</h2>
              

              <div className="flex justify-center items-center space-x-2 mb-4">
                <span className="text-gray-400 line-through text-sm">
                  ${oferta.precioOriginal.toFixed(2)}
                </span>
                <span className="text-rose-600 font-bold text-lg">
                  ${oferta.precioConDescuento.toFixed(2)}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-full bg-rose-500 text-white py-2 rounded-xl hover:bg-rose-600 transition-colors"
              >
                <ShoppingBag className="mr-2 w-5 h-5" />
                Agregar al carrito
              </motion.button>
            </div>

            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{
                duration: calcularSegundosRestantes(oferta.fechaFin || ""),
                ease: "linear",
              }}
              className="h-1 bg-rose-500"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/**
 * Calcula los segundos restantes hasta la fecha de fin de la oferta
 * para usar en la animación del temporizador visual inferior.
 */
function calcularSegundosRestantes(fechaFin: string): number {
  const fin = new Date(fechaFin).getTime();
  const ahora = Date.now();
  return Math.max((fin - ahora) / 1000, 0);
}
