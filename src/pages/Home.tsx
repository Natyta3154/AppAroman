import Hero from '../conponents/hero/Hero';
import OffersCarousel from '../conponents/carrouesel/OffersCarousel';
import { Link } from 'react-router-dom';
import { useDestacados } from '../hooks/useProductosDestacado';
import BlogSection from '../conponents/blog/BlogSection';
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
      <main className=" bg-gradient-to-b from-gray-100 bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] to-gray-200 py-20 px-4">
        <section className="max-w-7xl mx-auto px-5 sm:px-10 md:px-0 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Nuestros productos más elegidos y cuidadosamente seleccionados para ofrecerte calidad y estilo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {loadingDestacados
              ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-64 bg-gray-200 rounded-3xl animate-pulse"
                />
              ))
              : error
                ? <p className="col-span-4 text-center text-red-500">{error}</p>
                : destacados.length === 0
                  ? <p className="col-span-4 text-center text-gray-500">No hay productos destacados.</p>
                  : destacados.map((producto, index) => ( // Usamos 'index' para el delay de motion.div
                    <motion.div
                      key={producto.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 group relative"
                    >
                      <img
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                        src={producto.imagenUrl}
                        alt={String(producto.nombre)}
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                          {/* Usamos producto.nombre en lugar de post.titulo */}
                          {producto.nombre}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {/* Usamos producto.descripcion en lugar de post.descripcion */}
                          {producto.descripcion}
                        </p>
                        {/* Botón y precio, tomado del estilo de la primera tarjeta, pero enlazando a producto */}
                        <p className="mt-2 text-lg font-bold text-purple-600 mb-4">
                          ${producto.precio}
                        </p>
                        <Link
                          to={`/productos/${producto.id}`}
                          className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition inline-block"
                        >
                          Ver producto
                        </Link>
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
