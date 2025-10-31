import Navbnar from '../conponents/Navbar/Navbar';
import Hero from '../conponents/hero/Hero';
import OffersCarousel from '../conponents/carrouesel/OffersCarousel';
import { Link } from 'react-router-dom';
import { useProductos } from '../hooks/useproductos';
import { useDestacados } from '../hooks/useProductosDestacado';
//import BlogSection from '../conponents/blog/BlogSection';



export default function Home() {
  const {  loading: loadingProductos } = useProductos();
  const { destacados } = useDestacados();

  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <Navbnar />

      {/* Hero */}
      <Hero />

      {/* Texto introductorio antes del carrusel 
      <div className="mt-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Descubre nuestras ofertas exclusivas
        </h2>
        <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
          Cada semana seleccionamos los productos más destacados para ofrecerte promociones
          únicas y oportunidades imperdibles. Explora nuestra colección y encuentra
          artículos que combinan calidad, estilo y precio. ¡No dejes pasar estas ofertas!
        </p> */}
<div>
        {/* Carrusel */}
        {loadingProductos ? (
          <div className="flex justify-center space-x-4 overflow-x-auto">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-64 h-40 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
              ></div>
            ))}
          </div>
        ) : (
          <OffersCarousel />
        )}
      </div>

      {/* Productos Destacados */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-beige-50 to-white rounded-3xl mt-16 mb-24 text-center bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a]">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
          Productos Destacados
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Nuestros productos más elegidos y cuidadosamente seleccionados para ofrecerte calidad y estilo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {destacados.map((producto) => (
            <div
              key={producto.id}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Badge elegante */}
              <span className="absolute top-4 left-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold text-xs px-3 py-1 rounded-full uppercase animate-pulse shadow-md">
                Destacado
              </span>

              {/* Imagen con overlay elegante */}
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={producto.imagenUrl}
                  alt={String(producto.nombre)}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 rounded-2xl">
                  <Link
                    to={`/productos/${producto.id}`}
                    className="bg-purple-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-purple-700 transition-transform duration-300 transform hover:-translate-y-1 shadow-lg"
                  >
                    Ver producto
                  </Link>
                </div>

              </div>

              {/* Contenido */}
              <div className="mt-5 px-4 pb-4 flex justify-between items-start ">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <Link
                      to={`/productos/${producto.id}`}
                      className="hover:text-purple-600 transition-colors duration-300"
                    >
                      {producto.nombre}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {producto.descripcion}
                  </p>
                </div>
                <p className="text-lg font-bold text-purple-600">{producto.precioFinal}</p>
              </div>
            </div>
          ))}
        </div>


      </div>

      {/* Sección de Blog */}
      {/* <BlogSection /> */}
    </div>
  );
}
