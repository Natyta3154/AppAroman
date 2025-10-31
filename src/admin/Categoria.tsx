// src/admin/Categorias.tsx
import { useState } from "react";
import { useCategorias } from "../hooks/useCategorias";
import type { Categorias } from "../types/FraganciaCategoria";
import Modal from "./Modal";
import toast from "react-hot-toast";

export default function Categorias() {
  const { categorias, createCategoria, updateCategoria, deleteCategoria, refetch } = useCategorias();

  const [modalOpen, setModalOpen] = useState(false);
  const [editCategoria, setEditCategoria] = useState<Categorias | null>(null);
  const [nombre, setNombre] = useState("");

  const handleEdit = (c: Categorias) => {
    setEditCategoria(c);
    setNombre(c.nombre);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditCategoria(null);
    setNombre("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!nombre.trim()) return toast.error("El nombre no puede estar vacío");

    try {
      if (editCategoria) {
        await updateCategoria(editCategoria.id, nombre);
        toast.success("Categoría actualizada ✅");
      } else {
        await createCategoria(nombre);
        toast.success("Categoría creada ✅");
      }

      setModalOpen(false);
      setEditCategoria(null);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error ❌");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar categoría?")) return;
    try {
      await deleteCategoria(id);
      toast.success("Categoría eliminada ✅");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar ❌");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-20 px-4 flex justify-center items-center">
      <div className="w-full max-w-4x2 p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Administrar Categorías</h2>

        <div className="flex justify-center mb-4">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition"
          >
            Agregar Categoría
          </button>
        </div>

        <table className="w-full bg-gray-700 text-white rounded-lg overflow-hidden border border-gray-600 text-center">
          <thead>
            <tr className="bg-gray-600">
              <th className="px-4 py-2 border-b border-gray-500">ID</th>
              <th className="px-4 py-2 border-b border-gray-500">Nombre</th>
              <th className="px-4 py-2 border-b border-gray-500">Descripción</th>
              <th className="px-4 py-2 border-b border-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(c => (
              <tr key={c.id} className="border-b border-gray-500 hover:bg-gray-600 transition">
                <td className="px-4 py-2">{c.id}</td>
                <td className="px-4 py-2">{c.nombre}</td>
                <td className="px-4 py-2">{c.descripcion || "—"}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="px-2 py-1 bg-yellow-500 rounded hover:bg-yellow-400"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
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
          title={editCategoria ? "Editar Categoría" : "Agregar Categoría"}
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
              {editCategoria ? "Guardar cambios" : "Guardar Categoría"}
            </button>
          </div>
        </Modal>
      </div>
    </main>
  );
}
