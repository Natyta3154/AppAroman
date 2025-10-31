import { usePedidos } from "../hooks/usePedidos";

export default function PedidosTab() {
  const { pedidos, cargando, error, updatePedido } = usePedidos();

  const handleActualizarEstado = async (id: number, estado: string) => {
    try {
      await updatePedido(id, { estado });
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el estado del pedido");
    }
  };

  if (cargando) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-6 text-white text-center">
        Cargando pedidos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-6 text-red-400 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-white mb-4">Pedidos</h2>

      {pedidos.length === 0 ? (
        <p className="text-gray-400">No hay pedidos registrados.</p>
      ) : (
        <table className="min-w-full bg-gray-700 text-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-600">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Cliente</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id} className="border-b border-gray-500">
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2">{p.cliente}</td>
                <td className="px-4 py-2">${p.total.toFixed(2)}</td>
                <td className="px-4 py-2">{p.estado}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleActualizarEstado(p.id, "ENVIADO")}
                    className="px-2 py-1 bg-indigo-500 rounded hover:bg-indigo-400 transition"
                  >
                    Marcar como Enviado
                  </button>
                  <button
                    onClick={() => handleActualizarEstado(p.id, "CANCELADO")}
                    className="px-2 py-1 bg-red-500 rounded hover:bg-red-400 transition"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
