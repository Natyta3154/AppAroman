import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { useOfertas } from "../hooks/useOfertas";
import type { TipoDescuento, Oferta } from "../types/producto";

export default function OfertasAdmin() {
  const {
    ofertas,
    cargando,
    error,
    createOferta,
    updateOferta,
    deleteOferta,
    fetchOfertas,
  } = useOfertas(0, "admin");

  const [modalOpen, setModalOpen] = useState(false);
  const [editOferta, setEditOferta] = useState<Oferta | null>(null);
  const [productoId, setProductoId] = useState<number | null>(null);
  const [valorDescuento, setValorDescuento] = useState<number>(0);
  const [tipoDescuento, setTipoDescuento] =
    useState<TipoDescuento>("PORCENTAJE");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState(true);

  const [ofertasActivas, setOfertasActivas] = useState<Oferta[]>([]);
  const [ofertasInactivas, setOfertasInactivas] = useState<Oferta[]>([]);

  const calcularDescuento = (
    precio: number,
    tipo: TipoDescuento,
    valor: number
  ) => {
    if (tipo === "PORCENTAJE")
      return Math.max(0, precio - (precio * valor) / 100);
    if (tipo === "MONTO") return Math.max(0, precio - valor);
    return precio;
  };

  useEffect(() => {
    const hoy = new Date();

    const activas = ofertas.filter((o) => {
      if (!o.estado) return false;
      if (!o.fechaFin) return true;
      const f = new Date(o.fechaFin);
      f.setHours(23, 59, 59, 999);
      return f.getTime() >= hoy.getTime();
    });

    const inactivas = ofertas.filter((o) => {
      if (!o.estado) return true;
      if (!o.fechaFin) return false;
      const f = new Date(o.fechaFin);
      f.setHours(23, 59, 59, 999);
      return f.getTime() < hoy.getTime();
    });

    setOfertasActivas(activas);
    setOfertasInactivas(inactivas);
  }, [ofertas]);

  const handleCreate = () => {
    setEditOferta(null);
    setProductoId(null);
    setValorDescuento(0);
    setTipoDescuento("PORCENTAJE");
    setFechaInicio("");
    setFechaFin("");
    setEstado(true);
    setModalOpen(true);
  };

  const handleEdit = (o: Oferta) => {
    setEditOferta(o);
    setProductoId(o.productoId);
    setValorDescuento(o.valorDescuento);
    setTipoDescuento(o.tipoDescuento);
    setFechaInicio(o.fechaInicio);
    setFechaFin(o.fechaFin);
    setEstado(o.estado);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!productoId) return toast.error("Producto es obligatorio ❗");

    const payload = {
      productoId,
      valorDescuento,
      tipoDescuento,
      fechaInicio,
      fechaFin,
      estado,
    };

    try {
      if (editOferta) {
        await updateOferta(editOferta.idOferta, payload);
        toast.success("Oferta actualizada ✅");
      } else {
        await createOferta(payload);
        toast.success("Oferta creada ✅");
      }
      setModalOpen(false);
      setEditOferta(null);
      await fetchOfertas();
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar ❌");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta oferta?")) return;
    try {
      await deleteOferta(id);
      toast.success("Oferta eliminada");
      await fetchOfertas();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar ❌");
    }
  };

  if (cargando)
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] flex justify-center items-center text-gray-200">
        Cargando ofertas...
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] flex justify-center items-center">
        <p className="text-red-400">{error}</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-20 px-4 flex justify-center">
      <div className="w-full max-w-6xl p-6 bg-gray-800 rounded-xl shadow-lg text-white">
        <h2 className="text-3xl font-bold mb-8 text-center">
          🎯 Administrar Ofertas
        </h2>

        {/* RESUMEN */}
        <div className="flex justify-around mb-10 text-center">
          <div className="bg-green-600/20 border-l-4 border-green-500 px-5 py-3 rounded-lg">
            <p className="text-green-400 font-semibold">Activas</p>
            <p className="text-3xl font-bold">{ofertasActivas.length}</p>
          </div>

          <div className="bg-red-600/20 border-l-4 border-red-500 px-5 py-3 rounded-lg">
            <p className="text-red-400 font-semibold">Inactivas</p>
            <p className="text-3xl font-bold">{ofertasInactivas.length}</p>
          </div>

          <div className="bg-gray-600/20 border-l-4 border-gray-400 px-5 py-3 rounded-lg">
            <p className="text-gray-300 font-semibold">Total</p>
            <p className="text-3xl font-bold">{ofertas.length}</p>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-500 rounded hover:bg-indigo-400 transition shadow"
          >
            ➕ Nueva Oferta
          </button>
        </div>

        {/* ACTIVAS */}
        <h3 className="text-xl font-semibold mb-4 text-green-400">
          Ofertas Activas
        </h3>

        {ofertasActivas.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-700 mb-10">
            <table className="w-full text-gray-200 text-center">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="py-3">ID</th>
                  <th>Producto</th>
                  <th>Imagen</th>
                  <th>Original</th>
                  <th>Final</th>
                  <th>Fin</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {ofertasActivas.map((o) => {
                  const precioFinal =
                    o.precioConDescuento &&
                    o.precioConDescuento !== o.precio
                      ? o.precioConDescuento
                      : calcularDescuento(
                          o.precio,
                          o.tipoDescuento,
                          o.valorDescuento
                        );

                  return (
                    <tr
                      key={o.idOferta}
                      className="border-b border-gray-600 hover:bg-gray-600/60 transition"
                    >
                      <td className="py-3">{o.idOferta}</td>
                      <td>{o.nombreProducto}</td>
                      <td>
                        <img
                          src={o.imagenUrl || "/placeholder.png"}
                          className="w-16 h-16 object-cover rounded mx-auto"
                        />
                      </td>
                      <td className="text-gray-300">
                        ${o.precio.toFixed(2)}
                      </td>
                      <td className="text-green-400 font-bold">
                        ${precioFinal.toFixed(2)}
                      </td>
                      <td>{o.fechaFin || "—"}</td>

                      <td className="space-x-2 px-2">
                        <button
                          onClick={() => handleEdit(o)}
                          className="px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-400 shadow"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(o.idOferta)}
                          className="px-3 py-1 bg-red-500 rounded hover:bg-red-400 shadow"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 mb-6">No hay activas.</p>
        )}

        {/* INACTIVAS */}
        <h3 className="text-xl font-semibold mb-4 text-red-400">
          Ofertas Inactivas / Vencidas
        </h3>

        {ofertasInactivas.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-700 opacity-80">
            <table className="w-full text-gray-200 text-center">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="py-3">ID</th>
                  <th>Producto</th>
                  <th>Imagen</th>
                  <th>Original</th>
                  <th>Final</th>
                  <th>Fin</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {ofertasInactivas.map((o) => {
                  const precioFinal = calcularDescuento(
                    o.precio,
                    o.tipoDescuento,
                    o.valorDescuento
                  );

                  return (
                    <tr
                      key={o.idOferta}
                      className="border-b border-gray-600 hover:bg-gray-600/60 transition"
                    >
                      <td className="py-3">{o.idOferta}</td>
                      <td>{o.nombreProducto}</td>
                      <td>
                        <img
                          src={o.imagenUrl || "/placeholder.png"}
                          className="w-16 h-16 object-cover rounded mx-auto"
                        />
                      </td>
                      <td>${o.precio.toFixed(2)}</td>
                      <td className="text-gray-400">
                        ${precioFinal.toFixed(2)}
                      </td>
                      <td>{o.fechaFin || "—"}</td>
                      <td className="text-red-400 font-semibold">
                        Inactiva
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No hay vencidas.</p>
        )}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editOferta ? "Editar Oferta" : "Nueva Oferta"}
      >
        <div className="flex flex-col space-y-3 text-white">
          <label>
            Producto ID:
            <input
              type="number"
              className="w-full px-3 py-2 rounded bg-gray-700"
              value={productoId ?? ""}
              onChange={(e) => setProductoId(Number(e.target.value))}
            />
          </label>

          <label>
            Valor del Descuento:
            <input
              type="number"
              className="w-full px-3 py-2 rounded bg-gray-700"
              value={valorDescuento}
              onChange={(e) => setValorDescuento(Number(e.target.value))}
            />
          </label>

          <label>
            Tipo:
            <select
              className="w-full px-3 py-2 rounded bg-gray-700"
              value={tipoDescuento}
              onChange={(e) =>
                setTipoDescuento(e.target.value as TipoDescuento)
              }
            >
              <option value="PORCENTAJE">Porcentaje</option>
              <option value="MONTO">Monto Fijo</option>
            </select>
          </label>

          <label>
            Fecha Inicio:
            <input
              type="date"
              className="w-full px-3 py-2 rounded bg-gray-700"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </label>

          <label>
            Fecha Fin:
            <input
              type="date"
              className="w-full px-3 py-2 rounded bg-gray-700"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={estado}
              onChange={(e) => setEstado(e.target.checked)}
            />
            <span>Activa</span>
          </label>

          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition shadow"
          >
            {editOferta ? "Guardar Cambios" : "Crear Oferta"}
          </button>
        </div>
      </Modal>
    </main>
  );
}
