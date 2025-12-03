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
      <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] flex justify-center items-center">
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-white text-center">
          Cargando pedidos...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] flex justify-center items-center">
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-red-400 text-center">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-20 px-4 flex justify-center">
      <div className="w-full max-w-5xl p-6 bg-gray-800 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          📦 Pedidos
        </h2>

        {pedidos.length === 0 ? (
          <p className="text-gray-300 text-center">No hay pedidos registrados.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-700">
            <table className="min-w-full text-left text-gray-200">
              <thead>
                <tr className="bg-gray-600 text-white font-semibold">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {pedidos.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-600 hover:bg-gray-600/60 transition"
                  >
                    <td className="px-4 py-3">{p.id}</td>
                    <td className="px-4 py-3">{p.cliente}</td>
                    <td className="px-4 py-3">${p.total.toFixed(2)}</td>
                    <td className="px-4 py-3">{p.estado}</td>

                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleActualizarEstado(p.id, "ENVIADO")}
                        className="
                          px-3 py-1 rounded 
                          bg-indigo-500 text-white 
                          hover:bg-indigo-400 
                          transition-all shadow
                        "
                      >
                        Enviar
                      </button>

                      <button
                        onClick={() => handleActualizarEstado(p.id, "CANCELADO")}
                        className="
                          px-3 py-1 rounded 
                          bg-red-500 text-white 
                          hover:bg-red-400 
                          transition-all shadow
                        "
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </main>
  );
}
