import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { useOfertas } from "../hooks/useOfertas";
import type { TipoDescuento, Oferta } from "../types/producto";

export default function OfertasAdmin() {
  const { ofertas, cargando, error, createOferta, updateOferta, deleteOferta, fetchOfertas } =
    useOfertas(0, "admin");

  const [modalOpen, setModalOpen] = useState(false);
  const [editOferta, setEditOferta] = useState<Oferta | null>(null);
  const [productoId, setProductoId] = useState<number | null>(null);
  const [valorDescuento, setValorDescuento] = useState<number>(0);
  const [tipoDescuento, setTipoDescuento] = useState<TipoDescuento>("PORCENTAJE");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState(true);

  const [ofertasActivas, setOfertasActivas] = useState<Oferta[]>([]);
  const [ofertasInactivas, setOfertasInactivas] = useState<Oferta[]>([]);

  // ✅ Función auxiliar para calcular el precio con descuento (por si no vino del hook)
  const calcularDescuento = (precio: number, tipo: TipoDescuento, valor: number) => {
    if (tipo === "PORCENTAJE") return Math.max(0, precio - (precio * valor) / 100);
    if (tipo === "MONTO") return Math.max(0, precio - valor);
    return precio;
  };

  useEffect(() => {
    const hoy = new Date();

    const activas = ofertas.filter((o) => {
      if (!o.estado) return false;
      if (!o.fechaFin) return true;
      const fechaFin = new Date(o.fechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      return fechaFin.getTime() >= hoy.getTime();
    });

    const inactivas = ofertas.filter((o) => {
      if (!o.estado) return true;
      if (!o.fechaFin) return false;
      const fechaFin = new Date(o.fechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      return fechaFin.getTime() < hoy.getTime();
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

    const payload = { productoId, valorDescuento, tipoDescuento, fechaInicio, fechaFin, estado };

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
      toast.success("Oferta eliminada ✅");
      await fetchOfertas();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar ❌");
    }
  };

  if (cargando) return <p className="text-center mt-6 text-gray-300">Cargando ofertas...</p>;
  if (error) return <p className="text-center text-red-400">{error}</p>;

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">🎯 Administrar Ofertas</h2>

      {/* 📊 Resumen */}
      <div className="flex justify-around mb-6 text-center">
        <div className="bg-green-600/20 border-l-4 border-green-500 px-4 py-2 rounded">
          <p className="text-green-400 font-semibold">Activas</p>
          <p className="text-2xl font-bold">{ofertasActivas.length}</p>
        </div>
        <div className="bg-red-600/20 border-l-4 border-red-500 px-4 py-2 rounded">
          <p className="text-red-400 font-semibold">Inactivas/Vencidas</p>
          <p className="text-2xl font-bold">{ofertasInactivas.length}</p>
        </div>
        <div className="bg-gray-700/30 border-l-4 border-gray-400 px-4 py-2 rounded">
          <p className="text-gray-300 font-semibold">Total</p>
          <p className="text-2xl font-bold">{ofertas.length}</p>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-indigo-500 rounded hover:bg-indigo-400"
        >
          ➕ Agregar Oferta
        </button>
      </div>

      {/* 🟢 OFERTAS ACTIVAS */}
      <h3 className="text-xl font-semibold mb-3 text-green-400">Ofertas Activas</h3>
      {ofertasActivas.length > 0 ? (
        <table className="w-full text-white border-collapse border border-gray-600 text-center mb-8">
          <thead>
            <tr className="bg-gray-700">
              <th>ID</th>
              <th>Producto</th>
              <th>Imagen</th>
              <th>Precio Original</th>
              <th>Precio con Descuento</th>
              <th>Fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ofertasActivas.map((o) => {
              const precioFinal =
                o.precioConDescuento && o.precioConDescuento !== o.precio
                  ? o.precioConDescuento
                  : calcularDescuento(o.precio, o.tipoDescuento, o.valorDescuento);

              return (
                <tr key={o.idOferta} className="hover:bg-gray-600">
                  <td>{o.idOferta}</td>
                  <td>{o.nombreProducto}</td>
                  <td>
                    <img
                      src={o.imagenUrl || "/placeholder.png"}
                      alt={o.nombreProducto}
                      className="w-16 h-16 object-cover mx-auto rounded"
                    />
                  </td>
                  <td className="text-gray-300">${o.precio.toFixed(2)}</td>
                  <td className="text-green-400 font-semibold">${precioFinal.toFixed(2)}</td>
                  <td>{o.fechaFin || "—"}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(o)}
                      className="px-2 py-1 bg-yellow-500 rounded hover:bg-yellow-400"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(o.idOferta)}
                      className="px-2 py-1 bg-red-500 rounded hover:bg-red-400"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400 mb-6">No hay ofertas activas.</p>
      )}

      {/* 🔴 OFERTAS INACTIVAS */}
      <h3 className="text-xl font-semibold mb-3 text-red-400">Ofertas Inactivas / Vencidas</h3>
      {ofertasInactivas.length > 0 ? (
        <table className="w-full text-white border-collapse border border-gray-600 text-center opacity-75">
          <thead>
            <tr className="bg-gray-700">
              <th>ID</th>
              <th>Producto</th>
              <th>Imagen</th>
              <th>Precio Original</th>
              <th>Precio con Descuento</th>
              <th>Fin</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ofertasInactivas.map((o) => {
              const precioFinal =
                o.precioConDescuento && o.precioConDescuento !== o.precio
                  ? o.precioConDescuento
                  : calcularDescuento(o.precio, o.tipoDescuento, o.valorDescuento);

              return (
                <tr key={o.idOferta} className="hover:bg-gray-600">
                  <td>{o.idOferta}</td>
                  <td>{o.nombreProducto}</td>
                  <td>
                    <img
                      src={o.imagenUrl || "/placeholder.png"}
                      alt={o.nombreProducto}
                      className="w-16 h-16 object-cover mx-auto rounded"
                    />
                  </td>
                  <td>${o.precio.toFixed(2)}</td>
                  <td className="text-gray-400">${precioFinal.toFixed(2)}</td>
                  <td>{o.fechaFin || "—"}</td>
                  <td className="text-red-400 font-semibold">Inactiva</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400">No hay ofertas vencidas.</p>
      )}

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editOferta ? "Editar Oferta" : "Nueva Oferta"}
      >
        <div className="flex flex-col space-y-3">
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
            Valor Descuento:
            <input
              type="number"
              className="w-full px-3 py-2 rounded bg-gray-700"
              value={valorDescuento}
              onChange={(e) => setValorDescuento(Number(e.target.value))}
            />
          </label>

          <label>
            Tipo Descuento:
            <select
              className="w-full px-3 py-2 rounded bg-gray-700"
              value={tipoDescuento}
              onChange={(e) => setTipoDescuento(e.target.value as TipoDescuento)}
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
            <input type="checkbox" checked={estado} onChange={(e) => setEstado(e.target.checked)} />
            <span>Activo</span>
          </label>

          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
          >
            {editOferta ? "Guardar Cambios" : "Crear Oferta"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
