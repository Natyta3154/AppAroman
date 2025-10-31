// src/admin/FraganciasTab.tsx
import { useState } from "react";
import { useFragancias } from "../hooks/useFragancias";
import type { Fragancias } from "../types/FraganciaCategoria";
import Modal from "./Modal";
import toast from "react-hot-toast";

export default function FraganciasTab() {
  const { fragancias, createFragancia, updateFragancia, deleteFragancia, refetch } = useFragancias();

  const [modalOpen, setModalOpen] = useState(false);
  const [editFragancia, setEditFragancia] = useState<Fragancias | null>(null);
  const [nombre, setNombre] = useState("");

  const handleEdit = (f: Fragancias) => {
    setEditFragancia(f);
    setNombre(f.nombre);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditFragancia(null);
    setNombre("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!nombre.trim()) return toast.error("El nombre no puede estar vacío");

    try {
      if (editFragancia) {
        await updateFragancia(editFragancia.id, nombre);
        toast.success("Fragancia actualizada ✅");
      } else {
        await createFragancia(nombre);
        toast.success("Fragancia creada ✅");
      }
      setModalOpen(false);
      setEditFragancia(null);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error ❌");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar fragancia?")) return;
    try {
      await deleteFragancia(id);
      toast.success("Fragancia eliminada ✅");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar ❌");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-20 px-4 flex justify-center items-center">
      <div className="w-full max-w-6x3 p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Administrar Fragancias</h2>

        <div className="flex justify-center mb-4">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition"
          >
            Agregar Fragancia
          </button>
        </div>

        <table className="w-full bg-gray-700 text-white rounded-lg overflow-hidden border border-gray-600 text-center">
          <thead>
            <tr className="bg-gray-600">
              <th className="px-4 py-2 border-b border-gray-500">ID</th>
              <th className="px-4 py-2 border-b border-gray-500">Nombre</th>
              <th className="px-4 py-2 border-b border-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fragancias.map(f => (
              <tr key={f.id} className="border-b border-gray-500 hover:bg-gray-600 transition">
                <td className="px-4 py-2">{f.id}</td>
                <td className="px-4 py-2">{f.nombre}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(f)}
                    className="px-2 py-1 bg-yellow-500 rounded hover:bg-yellow-400"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="px-2 py-1 bg-red-500 rounded hover:bg-red-400"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editFragancia ? "Editar Fragancia" : "Agregar Fragancia"}
        >
          <div className="flex flex-col space-y-3 text-white">
            <label>
              Nombre:
              <input
                type="text"
                placeholder="Ej. Lavanda"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </label>

            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            >
              {editFragancia ? "Guardar cambios" : "Guardar Fragancia"}
            </button>
          </div>
        </Modal>
      </div>
    </main>
  );
}
