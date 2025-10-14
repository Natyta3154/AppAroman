import Navbnar from '../conponents/Navbar/Navbar';
import Hero from '../conponents/hero/Hero';
import OffersCarousel from '../conponents/carrouesel/OffersCarousel';
import { Link } from 'react-router-dom';
import { useProductos } from '../hooks/useproductos';
import { useDestacados } from '../hooks/useProductosDestacado';
import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

export default function Home() {
  const { productos, loading: loadingProductos } = useProductos();
  const { destacados, loading: loadingDestacados, error: errorDestacados } = useDestacados();

  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <Navbnar />

      {/* Hero */}
      <Hero />

      {/* Texto introductorio antes del carrusel */}
      <div className="mt-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Descubre nuestras ofertas exclusivas
        </h2>
        <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
          Cada semana seleccionamos los productos más destacados para ofrecerte promociones
          únicas y oportunidades imperdibles. Explora nuestra colección y encuentra
          artículos que combinan calidad, estilo y precio. ¡No dejes pasar estas ofertas!
        </p>

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
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-white rounded-2xl shadow-lg mt-16 mb-24 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
          Productos Destacados
        </h2>
        <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
          Estos son nuestros productos más populares y recomendados para ti. Cada uno ha
          sido seleccionado cuidadosamente por su calidad y valor, garantizando una
          experiencia de compra excepcional.
        </p>

        {errorDestacados && (
          <p className="text-red-500 mb-4">{errorDestacados}</p>
        )}

        {loadingDestacados ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-lg p-4 shadow animate-pulse h-64"
              >
                <div className="w-full h-40 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destacados.map((producto: { id: Key | null | undefined; imagenUrl: string | undefined; nombre: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; descripcion?: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; precioFinal: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
              <div
                key={producto.id}
                className="group relative bg-white rounded-lg p-4 shadow hover:shadow-lg transition"
              >
                <img
                  src={producto.imagenUrl}
                  alt={String(producto.nombre || '')}
                  className="aspect-square w-full rounded-md object-cover group-hover:opacity-75"
                />

                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link
                        to={`/productos/${producto.id}`}
                        className="hover:text-indigo-600"
                      >
                        {producto.nombre}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{producto.descripcion}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{producto.precioFinal}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
