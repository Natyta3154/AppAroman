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
      <main className="bg-gradient-to-b from-brand-light via-brand-primary to-brand-dark py-20 px-4 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-primary opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

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
                  className="w-full h-80 bg-white/20 backdrop-blur-md rounded-3xl animate-pulse shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]"
                />
              ))
              : error
                ? <div className="col-span-full bg-red-500/20 backdrop-blur-md p-6 rounded-2xl border border-red-500/30 text-center text-white">{error}</div>
                : destacados.length === 0
                  ? <p className="col-span-full text-center text-white/80 text-lg">No hay productos destacados por el momento.</p>
                  : destacados.map((producto, index) => (
                    <motion.div
                      key={producto.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.7, type: "spring" }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] overflow-hidden hover:bg-white/20 hover:border-white/40 transform hover:-translate-y-3 transition-all duration-500 group relative flex flex-col"
                    >
                      <div className="overflow-hidden relative h-56">
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          src={producto.imagenUrl}
                          alt={String(producto.nombre)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primario-300 transition-colors duration-300 drop-shadow-sm">
                          {producto.nombre}
                        </h3>
                        <p className="text-white/80 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                          {producto.descripcion}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <p className="text-2xl font-black text-primario-300 drop-shadow-sm">
                            ${producto.precio}
                          </p>
                          <Link
                            to={`/productos/${producto.id}`}
                            className="bg-white/20 hover:bg-white text-white hover:text-brand-primary font-semibold px-6 py-2.5 rounded-full backdrop-blur-md border border-white/30 transition-all duration-300 shadow-lg"
                          >
                            Ver más
                          </Link>
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
