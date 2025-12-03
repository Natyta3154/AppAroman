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
    <div
      className="
        p-6 
        bg-white/20 backdrop-blur-xl 
        rounded-3xl shadow-xl 
        border border-white/30
        text-gray-900
      "
    >
      <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">
        Fragancias
      </h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={handleCreate}
          className="
            px-5 py-2 
            bg-gradient-to-r from-purple-600 to-pink-500 
            text-white rounded-full 
            shadow-md hover:shadow-xl 
            transition-all duration-300
          "
        >
          Agregar Fragancia
        </button>
      </div>

      {/* Tabla con diseño moderno y scroll mobile */}
      <div className="overflow-x-auto rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg">
        <table className="min-w-full text-left text-gray-900">
          <thead>
            <tr className="bg-white/20 backdrop-blur-xl text-purple-900 font-semibold">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fragancias.map((f) => (
              <tr
                key={f.id}
                className="border-b border-purple-200/30 hover:bg-white/30 transition"
              >
                <td className="px-4 py-3">{f.id}</td>
                <td className="px-4 py-3">{f.nombre}</td>

                <td className="px-4 py-3 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(f)}
                    className="
                      px-3 py-1 rounded-full 
                      bg-yellow-500 text-white 
                      hover:bg-yellow-400 
                      transition-all shadow
                    "
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(f.id)}
                    className="
                      px-3 py-1 rounded-full 
                      bg-red-500 text-white 
                      hover:bg-red-400 
                      transition-all shadow
                    "
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editFragancia ? "Editar Fragancia" : "Crear Fragancia"}
      >
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Nombre"
            className="px-3 py-2 rounded bg-white/30 backdrop-blur-lg border border-white/40 text-gray-900"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <button
            onClick={handleSave}
            className="
              px-4 py-2 
              bg-gradient-to-r from-purple-600 to-pink-500 
              text-white rounded-full 
              shadow-md hover:shadow-xl 
              transition-all duration-300
            "
          >
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}
