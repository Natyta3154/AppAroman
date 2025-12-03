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
        Categorías
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
          Crear Categoría
        </button>
      </div>

      {/* Tabla con scroll para mobile */}
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
                className="border-b border-purple-200/30 hover:bg-white/30 transition"
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

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCategoria ? "Editar Categoría" : "Crear Categoría"}
      >
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Nombre"
            className="px-3 py-2 rounded bg-white/30 backdrop-blur-lg border border-white/40"
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
