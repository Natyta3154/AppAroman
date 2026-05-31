import Hero from '../components/hero/Hero';
import OffersCarousel from '../components/carrouesel/OffersCarousel';
import { Link } from 'react-router-dom';
import { useDestacados } from '../hooks/useProductosDestacado';
import BlogSection from '../components/blog/BlogSection';
import { motion } from 'framer-motion';

export default function Home() {
  const { destacados, loading: loadingDestacados, error } = useDestacados();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero */}
      <Hero />

      {/* Carrusel de ofertas */}
      <section className="mt-12">
        <OffersCarousel />
      </section>

      {/* Productos Destacados */}
      <main className="bg-gradient-to-b from-brand-primary via-brand-dark to-brand-dark py-20 px-4 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <section className="max-w-7xl mx-auto px-5 sm:px-10 md:px-0 py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-extrabold text-white mb-6 drop-shadow-md tracking-tight">
              Productos Destacados
            </h2>
            <p className="text-white/80 text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Descubre nuestras fragancias más exclusivas, seleccionadas especialmente para brindar calma y armonía a tu hogar.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loadingDestacados
              ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-80 bg-white/20 backdrop-blur-md rounded-xl animate-pulse shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-gray-100"
                />
              ))
              : error
                ? <div className="col-span-full bg-red-500/20 backdrop-blur-md p-6 rounded-2xl border border-red-500/30 text-center text-white">{error}</div>
                : destacados.length === 0
                  ? <p className="col-span-full text-center text-white/80 text-lg">No hay productos destacados por el momento.</p>
                  : destacados.map((producto, index) => (
                    <motion.div
                      key={producto.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)" }}
                      whileTap={{ scale: 0.99 }}
                      viewport={{ once: true }}
                      className="relative bg-white/10 backdrop-blur-lg rounded-xl shadow-xl transition-all duration-300 overflow-hidden group border border-white/20 flex flex-col"
                    >
                      <div className="relative overflow-hidden h-56">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          src={producto.imagenUrl}
                          alt={String(producto.nombre)}
                        />
                        {/* Overlay detalle */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                            <Link
                                to={`/productos/${producto.id}`}
                                className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 shadow-lg hover:bg-white/30 text-white flex items-center gap-2 font-semibold transition-all"
                            >
                                <span className="text-xl">👁️</span>
                                Ver Detalle
                            </Link>
                        </div>
                        {/* Badge de Destacado */}
                        <span className="absolute top-3 left-3 bg-indigo-500/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border border-indigo-400/50">
                            🌟 Destacado
                        </span>
                      </div>
                      
                      <div className="p-5 flex flex-col flex-grow justify-between min-h-[140px]">
                        <div>
                            <h3 className="text-xl font-bold text-white line-clamp-1 hover:text-indigo-300 transition-colors">
                            <Link to={`/productos/${producto.id}`}>{producto.nombre}</Link>
                            </h3>
                            <p className="text-sm text-white/70 mt-1 line-clamp-2">
                            {producto.descripcion}
                            </p>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-2xl font-bold text-indigo-300">
                            ${producto.precio}
                            </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
          </div>
        </section>
      </main>
      
      <BlogSection />
    </div>
  );
}
