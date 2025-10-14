// admin/OfertasTab.tsx
import { useEffect, useState } from "react";
import { productosService } from "../services/productoService";
import type { Producto } from "../types/producto";

export default function OfertasTab() {
  const [ofertas, setOfertas] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productosService.getAll()
      .then((productos) => setOfertas(productos.filter(p => p.oferta)))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Eliminar oferta?")) return;
    await productosService.remove(id);
    setOfertas(ofertas.filter(p => p.id !== id));
  };

  if (loading) return <p>Cargando ofertas...</p>;

  return (
    <table className="min-w-full border border-gray-700 text-center">
      <thead className="bg-gray-800">
        <tr>
          <th className="px-4 py-2 border">ID</th>
          <th className="px-4 py-2 border">Nombre</th>
          <th className="px-4 py-2 border">Precio</th>
          <th className="px-4 py-2 border">Descuento</th>
          <th className="px-4 py-2 border">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ofertas.map(p => (
          <tr key={p.id} className="border-b border-gray-700">
            <td className="px-4 py-2">{p.id}</td>
            <td className="px-4 py-2">{p.nombre}</td>
            <td className="px-4 py-2">${p.precio}</td>
            <td className="px-4 py-2">{p.descuento}%</td>
            <td className="px-4 py-2">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(p.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
