import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo con imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img-hero.jpg')", // 👈 asegúrate de tener esta imagen en /public
        }}
      />

      {/* Capa oscura para mejorar contraste */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contenido con animación */}
      <motion.div
        className="relative z-10 p-8 text-center max-w-3xl mx-auto text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">
          Bienvenido a <span className="text-yellow-400">Aromanza</span> — Conectá con la esencia de tu alma
        </h1>
        <p className="text-base sm:text-lg text-gray-200 mb-6">
          Sumergite en un universo de calma y energía positiva.  
          Cada aroma es una caricia para el alma, una invitación a reconectar con tu interior  
          y llenar tus espacios de armonía y belleza natural.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/productos"
            className="rounded-md bg-yellow-600 px-6 py-3 text-white font-semibold hover:bg-yellow-500 transition"
          >
            Explorar aromas
          </Link>
          <Link
            to="/ofertas"
            className="rounded-md px-6 py-3 border border-white text-white font-semibold hover:bg-yellow-600 hover:text-black transition"
          >
            Inspirarme
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
