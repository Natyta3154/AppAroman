import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../../App.css";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo con imagen */}
      <div className="absolute inset-0 w-full h-full">
        <picture>
          {/* Imagen para pantallas grandes */}
          <source media="(min-width:1024px)" srcSet="/img-hero.jpg" />
          {/* Imagen para tablet */}
          <source media="(min-width:640px)" srcSet="/hero-movil.png" />
          {/* Imagen por defecto / móvil */}
          <img
            src="/hero-movil.png"
            alt="Hero Aromanza"
            className="w-full h-full object-cover object-center"
          />
        </picture>
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Contenido por encima de la imagen */}
      <motion.div
        className="relative z-20 text-center max-w-3xl mx-auto px-6 text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h1 className="text-3xl sm:text-5xl text-black md:text-6xl font-bold mb-4 leading-snug">
          Bienvenido a <span className="font-extrabold text-black">Aromanza</span> — Conectá con la esencia de tu alma
        </h1>
        <p className="font-extrabold text-black sm:text-lg md:text-xl mb-6 leading-relaxed">
          Sumergite en un universo de calma y energía positiva. Cada aroma es una caricia para el alma, una invitación a reconectar con tu interior y llenar tus espacios de armonía y belleza natural.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/productos"
            className="rounded-md bg-yellow-600 px-6 py-3 text-black font-semibold hover:bg-yellow-500 transition"
          >
            Explorar nustro catálogo
          </Link>
          <Link
            to="/ofertas"
            className="rounded-md px-6 py-3 border border-white text-black font-semibold hover:bg-yellow-600 hover:text-black transition"
          >
            Ofertas
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
