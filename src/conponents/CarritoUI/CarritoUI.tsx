// src/components/CarritoUI.tsx

import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Tag, Truck, Percent } from "lucide-react";
import { useCarrito } from "../../contex/CarritoContext.tsx";
import { usePagoMercadoPago } from "../../hooks/usePagoMercadoPago";
import { useAuth } from "../../hooks/useAuth";


/**
 * 🛒 Componente: CarritoUI
 * -------------------------------------------------------------
 * Este componente representa la interfaz visual del carrito de compras.
 * - Muestra los productos agregados por el usuario.
 * - Permite incrementar, decrementar o eliminar productos.
 * - Presenta un resumen del pedido con total, impuestos y botones de acción.
 * - Utiliza animaciones suaves con Framer Motion.
 * - Integra íconos de lucide-react para reforzar la semántica visual.
 * - Mantiene un diseño responsivo y moderno con TailwindCSS.
 * -------------------------------------------------------------
 */
export default function CarritoUI() {
  // Obtenemos los valores y funciones desde el contexto del carrito
  const { carrito, incrementar, decrementar, eliminarProducto, total } = useCarrito();
  // Hook personalizado para manejar el pago con MercadoPago
  const { handlePagar } = usePagoMercadoPago();

  // Obtenemos el estado de autenticación del usuario
  const { loading } = useAuth();


  /**
   * 🧩 Si el carrito está vacío, se muestra una vista alternativa:
   * - Mensaje amigable
   * - Ícono ilustrativo
   * - Botón para regresar al catálogo
   */
  if (carrito.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          {/* Ícono principal */}
          <ShoppingCart className="w-20 h-20 text-gray-400 mb-4" />

          {/* Mensaje principal */}
          <p className="text-gray-600 text-xl font-medium mb-2">
            Tu carrito está vacío 😔
          </p>

          {/* Subtítulo motivacional */}
          <p className="text-gray-500 mb-6 text-sm">
            Agrega algunos productos y vuelve para completar tu compra.
          </p>

          {/* Botón de acción */}
          <a
            href="/productos"
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Ir al catálogo
          </a>
        </motion.div>
      </div>
    );
  }

  /**
   * 🧾 Vista principal del carrito (cuando hay productos)
   * Se divide en dos secciones:
   * 1. Lista de productos (columna izquierda)
   * 2. Resumen del pedido (columna derecha)
   */
  return (
    <main className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 via-white to-gray-200 bg-[url('/public/img-hero.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden">
      <div className="max-w-6xl w-full grid lg:grid-cols-3 gap-10 p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl">


        {/* 🧺 SECCIÓN: Lista de productos del carrito */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
        >
          {/* Encabezado */}
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-yellow-600" />
            Tu Carrito
          </h3>
          <hr className="border-gray-200 mb-8" />

          {/* Lista de productos */}
          <div className="space-y-8">
            {carrito.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between border-b border-gray-100 pb-4"
              >
                {/* 📸 Imagen + detalles */}
                <div className="flex items-center gap-5">
                  {/* Imagen del producto */}
                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                    <img
                      src={p.imagenUrl || "https://via.placeholder.com/150"}
                      alt={p.nombre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Descripción y controles */}
                  <div>
                    {/* Nombre */}
                    <h4 className="text-md font-semibold text-gray-900">
                      {p.nombre}
                    </h4>

                    {/* Botón eliminar */}
                    <p
                      onClick={() => eliminarProducto(p.id)}
                      className="text-xs text-red-500 hover:text-red-600 cursor-pointer mt-1 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Eliminar
                    </p>

                    {/* Controles de cantidad */}
                    <div className="flex items-center mt-3 border border-gray-300 rounded-md">
                      <button
                        onClick={() => decrementar(p.id)}
                        className="px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-l-md transition-all"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 text-gray-800 font-medium">
                        {p.quantity ?? 1}
                      </span>
                      <button
                        onClick={() => incrementar(p.id)}
                        className="px-3 py-1 text-gray-700 hover:bg-gray-200 rounded-r-md transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* 💰 Precio final del producto */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900">
                    ${(p.precioFinal ?? p.precio).toFixed(2)}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 💳 SECCIÓN: Resumen del pedido */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
        >
          {/* Título */}
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Tag className="w-6 h-6 text-yellow-600" />
            Resumen del pedido
          </h3>
          <hr className="border-gray-200 mb-8" />

          {/* Detalles del resumen */}
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex justify-between">
              <span className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-yellow-600" /> Descuento
              </span>
              <span className="text-gray-900 font-semibold">$0.00</span>
            </li>

            {/*<li className="flex justify-between">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-yellow-600" /> Envío
              </span>
              <span className="text-gray-900 font-semibold">$2.00</span>
            </li>*/}

            {/*<li className="flex justify-between">
              <span>Impuestos</span>
              <span className="text-gray-900 font-semibold">
                ${(total * 0.025).toFixed(2)}
              </span>
            </li>*/}

            {/* Total final */}
            <li className="flex justify-between text-gray-900 text-lg font-bold border-t border-gray-200 pt-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </li>
          </ul>

          {/* 🧾 Botones de acción */}
          <div className="mt-8 space-y-3">
            {/* Botón principal */}
            <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.97 }}
  className="w-full bg-yellow-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-yellow-500 transition-all"
  onClick={handlePagar}
>
  {loading ? "Cargando..." : "Finalizar compra"}
</motion.button>



            {/* Botón para seguir comprando */}
            <a
              href="/productos"
              className="w-full inline-block text-center border border-gray-300 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Seguir comprando
            </a>
          </div>

          {/* 🎟️ Campo de código promocional 
          <div className="mt-8">
            <p className="text-sm font-medium text-gray-800 mb-2">
              ¿Tenés un código de descuento?
            </p>
            <div className="flex overflow-hidden border border-yellow-600 rounded-lg">
              <input
                type="text"
                placeholder="Ingresar código"
                className="w-full outline-none px-4 py-2 text-sm text-gray-700"
              />
              <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 text-sm font-semibold transition-all">
                Aplicar
              </button>
            </div>
          </div>*/}
        </motion.div>
      </div>

    </main>
  );
}
