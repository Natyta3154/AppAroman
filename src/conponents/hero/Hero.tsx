'use client'

import { Link } from 'react-router-dom'

export default function Hero() {
  return (
<div
  className="relative bg-center  bg-cover w-[100] h-[80vh] sm:h-[70vh] flex items-center justify-center overflow-hidden"
  style={{
    backgroundImage: `url(${import.meta.env.VITE_HERO_IMG})`,
    backgroundSize: "contain", // mantiene proporción sin distorsionar
    backgroundPosition: "center", // centra la imagen
  }}
>
  {/* Overlay semitransparente para contraste */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Contenido centrado */}
  <div className="relative z-10 p-8 text-center max-w-3xl mx-auto">
    <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">
      Data to enrich your online business
    </h1>
    <p className="text-base sm:text-lg text-gray-200 mb-6">
      Potenciá tus resultados con soluciones inteligentes, diseñadas para destacar
      en el mundo digital. Todo lo que necesitás, en un solo lugar.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Link
        to="/productos"
        className="rounded-md bg-yellow-600 px-6 py-3 text-white font-semibold hover:bg-yellow-500 transition"
      >
        Get Started
      </Link>
      <Link
        to="/ofertas"
        className="rounded-md px-6 py-3 border border-white text-white font-semibold hover:bg-yellow-600 hover:text-black transition"
      >
        Learn More
      </Link>
    </div>
  </div>
</div>


  )
}
