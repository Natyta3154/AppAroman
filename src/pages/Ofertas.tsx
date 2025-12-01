import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import axios from "axios";
import { useCarrito } from "../contex/CarritoContext.tsx";
import type { Oferta, ProductoOferta } from "../types/producto";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Ofertas() {
  const [ofertas, setOfertas] = useState<ProductoOferta[]>([]);
  const [ofertasActivas, setOfertasActivas] = useState<ProductoOferta[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { agregarAlCarrito } = useCarrito();

  const fetchOfertas = useCallback(async () => {
    try {
      setCargando(true);
      const { data } = await axios.get<Oferta[]>(`${API_BASE}/api/ofertas/listar`, {
        withCredentials: true,
      });

      const ofertasTransformadas: ProductoOferta[] = data.map((o) => ({
        id: o.idOferta,
        nombre: o.nombreProducto,
        imagenUrl: o.imagenUrl,
        precio: o.precio,
        precioConDescuento:
          o.precioConDescuento ??
          (o.tipoDescuento === "PORCENTAJE"
            ? o.precio - (o.precio * o.valorDescuento) / 100
            : o.precio - o.valorDescuento),
        fechaInicio: o.fechaInicio,
        fechaFin: o.fechaFin,
        estado: o.estado,
      }));

      setOfertas(ofertasTransformadas);
    } catch (err) {
      console.error("Error al listar las ofertas:", err);
      setError("No se pudieron listar las ofertas");
    } finally {
      setCargando(false);
    }
  }, []);

  // 🔥 SOLO filtramos activas
  useEffect(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const activas = ofertas.filter((o) => {
      if (!o.estado || !o.fechaFin) return false;
      const fin = new Date(o.fechaFin + "T23:59:59");
      return fin >= hoy;
    });

    setOfertasActivas(activas);
  }, [ofertas]);

  useEffect(() => {
    fetchOfertas();
  }, [fetchOfertas]);

  const formatPrice = (precio: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(precio);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-4xl text-rose-500">
          🛍️
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-20 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-10 text-gray-800"
      >
        🔥 Ofertas Especiales 🔥
      </motion.h1>

      {/* SOLO OFERTAS ACTIVAS */}
      <h2 className="text-2xl font-semibold mb-6 text-green-600 text-center">🟢 Activas</h2>

      {ofertasActivas.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto mb-12">
          {ofertasActivas.map((oferta, i) => (
            <motion.div
              key={oferta.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="relative">
                <img src={oferta.imagenUrl} alt={oferta.nombre} className="w-full h-60 object-cover" />
                <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {oferta.precio && oferta.precioConDescuento
                    ? `-${Math.round(((oferta.precio - oferta.precioConDescuento) / oferta.precio) * 100)}%`
                    : "OFERTA"}
                </div>
              </div>

              <div className="p-5 text-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{oferta.nombre}</h2>
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <span className="text-gray-400 line-through text-sm">{formatPrice(oferta.precio)}</span>
                  <span className="text-green-600 font-bold text-lg">{formatPrice(oferta.precioConDescuento)}</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => agregarAlCarrito(oferta)}
                  className="flex items-center justify-center w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition-colors"
                >
                  <ShoppingBag className="mr-2 w-5 h-5" />
                  Agregar al carrito
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mb-12">No hay ofertas activas.</p>
      )}
    </main>
  );
}
