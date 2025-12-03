import { useState } from "react";
import { useCategoriasPost } from "../hooks/useCategoriaPost";
import type { CategoriaPost } from "../types/post";

import Modal from "./Modal";
import toast from "react-hot-toast";

export default function CategoriaPostTab() {
  const { categorias, createCategoria, updateCategoria, deleteCategoria } =
    useCategoriasPost();

  const [modalOpen, setModalOpen] = useState(false);
  const [editCategoria, setEditCategoria] = useState<CategoriaPost | null>(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleCreate = () => {
    setEditCategoria(null);
    setNombre("");
    setDescripcion("");
    setModalOpen(true);
  };

  const handleEdit = (c: CategoriaPost) => {
    setEditCategoria(c);
    setNombre(c.nombre ?? "");
    setDescripcion(c.descripcion ?? "");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!nombre.trim()) return toast.error("El nombre es obligatorio ❗");

    const payload = { nombre, descripcion };

    try {
      if (editCategoria) {
        await updateCategoria(editCategoria.id, payload);
        toast.success("Categoría actualizada");
      } else {
        await createCategoria(payload);
        toast.success("Categoría creada");
      }
      setModalOpen(false);
      setEditCategoria(null);
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await deleteCategoria(id);
      toast.success("Categoría eliminada");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-400 to-pink-300 p-6 flex justify-center">
      <div
        className="
          w-full max-w-4xl 
          p-6 
          bg-white/20 backdrop-blur-xl 
          rounded-3xl shadow-xl 
          border border-white/30
        "
      >
        <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
          📂 Categorías del Blog
        </h2>

        {/* Botón crear */}
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
            ➕ Agregar Categoría
          </button>
        </div>

        {/* Tabla con el mismo estilo translúcido */}
        <div className="overflow-x-auto rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg">
          <table className="min-w-full text-left text-gray-900">
            <thead>
              <tr className="bg-white/20 backdrop-blur-xl text-purple-900 font-semibold">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((c) => (
                <tr
                  key={c.id}
                  className="
                    border-b border-purple-200/30 
                    hover:bg-white/30 
                    transition
                  "
                >
                  <td className="px-4 py-3">{c.id}</td>
                  <td className="px-4 py-3">{c.nombre}</td>
                  <td className="px-4 py-3">{c.descripcion || "—"}</td>

                  <td className="px-4 py-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(c)}
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
                      onClick={() => handleDelete(c.id)}
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

        {/* Modal con el mismo diseño del panel admin */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editCategoria ? "Editar Categoría" : "Nueva Categoría"}
        >
          <div className="flex flex-col space-y-3 text-gray-900">
            <input
              type="text"
              placeholder="Nombre"
              className="
                px-3 py-2 rounded 
                bg-white/30 backdrop-blur-lg 
                border border-white/40
              "
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <textarea
              placeholder="Descripción"
              className="
                px-3 py-2 rounded h-32
                bg-white/30 backdrop-blur-lg 
                border border-white/40
              "
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />

            <button
              onClick={handleSave}
              className="
                mt-3 px-4 py-2 
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
    </main>
  );
}
