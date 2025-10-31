import { useState } from "react";
import { useCategoriasPost } from "../hooks/useCategoriaPost";
import type { CategoriaPost } from "../types/post";

import Modal from "./Modal";
import toast from "react-hot-toast";

export default function CategoriaPost() {
  const { categorias, createCategoria, updateCategoria, deleteCategoria } = useCategoriasPost();

  const [modalOpen, setModalOpen] = useState(false);
  const [editCategoria, setEditCategoria] = useState<CategoriaPost | null>(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // --- CREAR NUEVA CATEGORÍA ---
  const handleCreate = () => {
    setEditCategoria(null);
    setNombre("");
    setDescripcion("");
    setModalOpen(true);
  };

  // --- EDITAR CATEGORÍA ---
  const handleEdit = (c: CategoriaPost) => {
    setEditCategoria(c);
    setNombre(c.nombre ?? "");
    setDescripcion(c.descripcion ?? "");
    setModalOpen(true);
  };

  // --- GUARDAR CAMBIOS ---
  const handleSave = async () => {
    if (!nombre.trim()) return toast.error("El nombre es obligatorio ❗");

    const payload = { nombre, descripcion };

    try {
      if (editCategoria) {
        await updateCategoria(editCategoria.id, payload);
        toast.success("Categoría actualizada ✅");
      } else {
        await createCategoria(payload);
        toast.success("Categoría creada ✅");
      }
      setModalOpen(false);
      setEditCategoria(null);
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al guardar ❌");
    }
  };

  // --- ELIMINAR CATEGORÍA ---
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
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
      <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          🏷 Administrar Categorías de Posts
        </h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition"
          >
            Agregar Categoría
          </button>
        </div>

        <table className="w-full bg-gray-700 text-white rounded-lg overflow-hidden border border-gray-600 text-center">
          <thead>
            <tr className="bg-gray-600 divide-x divide-gray-500">
              <th className="px-4 py-2 border-b border-gray-500">ID</th>
              <th className="px-4 py-2 border-b border-gray-500">Nombre</th>
              <th className="px-4 py-2 border-b border-gray-500">Descripción</th>
              <th className="px-4 py-2 border-b border-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {categorias.map((c) => (
              <tr key={c.id} className="divide-x divide-gray-600 hover:bg-gray-600 transition">
                <td className="px-4 py-2">{c.id}</td>
                <td className="px-4 py-2">{c.nombre}</td>
                <td className="px-4 py-2">{c.descripcion}</td>
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

        {/* MODAL */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editCategoria ? "Editar Categoría" : "Nueva Categoría"}
        >
          <div className="flex flex-col space-y-3 text-white">
            <label>
              Nombre:
              <input
                type="text"
                placeholder="Nombre de la categoría"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </label>

            <label>
              Descripción:
              <input
                type="text"
                placeholder="Descripción opcional"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </label>

            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            >
              {editCategoria ? "Guardar cambios" : "Crear Categoría"}
            </button>
          </div>
        </Modal>
      </div>
    </main>
  );
}
