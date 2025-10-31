import { useEffect, useState } from "react";
import { usePosts } from "../hooks/usePosts"; // 👈 usamos el hook en lugar del service
import type { Post, CategoriaPost } from "../types/post";
import Modal from "./Modal";
import toast from "react-hot-toast";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export default function PostBlog() {
  const {
    posts,
    cargando,
    error,
    crearPost,
    actualizarPost,
    eliminarPost,
  } = usePosts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [categorias, setCategorias] = useState<CategoriaPost[]>([]);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [categoria, setCategoria] = useState<CategoriaPost | null>(null);

  // --- CARGAR CATEGORÍAS ---
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await axios.get<CategoriaPost[]>(`${API_BASE}/api/categoriasPost`, {
          withCredentials: true,
        });
        setCategorias(res.data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudieron cargar las categorías ❌");
      }
    }
    fetchCategorias();
  }, []);

  // --- CREAR NUEVO POST ---
  const handleCreate = () => {
    setEditPost(null);
    setTitulo("");
    setDescripcion("");
    setContenido("");
    setImagenUrl("");
    setCategoria(null);
    setModalOpen(true);
  };

  // --- EDITAR POST ---
  const handleEdit = (p: Post) => {
    setEditPost(p);
    setTitulo(p.titulo ?? "");
    setDescripcion(p.descripcion ?? "");
    setContenido(p.contenido ?? "");
    setImagenUrl(p.imagenUrl ?? "");
    setCategoria(p.category ?? null);
    setModalOpen(true);
  };

  // --- GUARDAR (CREAR / ACTUALIZAR) ---
  const handleSave = async () => {
    if (!titulo.trim() || !descripcion.trim()) {
      return toast.error("El título y la descripción son obligatorios ❗");
    }

    const payload = {
      titulo,
      descripcion,
      contenido,
      imagenUrl,
      categoria: categoria ? { id: categoria.id } : null,
    };

    try {
      if (editPost) {
        await actualizarPost(editPost.id, payload);
        toast.success("Post actualizado ✅");
      } else {
        await crearPost(payload);
        toast.success("Post creado ✅");
      }
      setModalOpen(false);
      setEditPost(null);
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al guardar ❌");
    }
  };

  // --- ELIMINAR POST ---
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este post?")) return;
    try {
      await eliminarPost(id);
      toast.success("Post eliminado ✅");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar ❌");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-20 px-4 flex justify-center items-center">
      <div className="w-full max-w-6xl p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          📝 Administrar Posts del Blog
        </h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition"
          >
            Agregar Post
          </button>
        </div>

        {cargando ? (
          <p className="text-center text-white">Cargando posts...</p>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : (
          <table className="w-full bg-gray-700 text-white rounded-lg overflow-hidden border border-gray-600 text-center">
            <thead>
              <tr className="bg-gray-600 divide-x divide-gray-500">
                <th className="px-4 py-2 border-b border-gray-500">ID</th>
                <th className="px-4 py-2 border-b border-gray-500">Título</th>
                <th className="px-4 py-2 border-b border-gray-500">Descripción</th>
                <th className="px-4 py-2 border-b border-gray-500">Contenido</th>
                <th className="px-4 py-2 border-b border-gray-500">Imagen</th>
                <th className="px-4 py-2 border-b border-gray-500">Categoría</th>
                <th className="px-4 py-2 border-b border-gray-500">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-600">
              {posts.map((p) => (
                <tr
                  key={p.id}
                  className="divide-x divide-gray-600 hover:bg-gray-600 transition"
                >
                  <td className="px-4 py-2">{p.id}</td>
                  <td className="px-4 py-2">{p.titulo}</td>
                  <td className="px-4 py-2">{p.descripcion}</td>
                  <td className="px-4 py-2 text-sm text-gray-300 line-clamp-2">
                    {p.contenido}
                  </td>
                  <td className="px-4 py-2 text-sm truncate max-w-[150px]">
                    {p.imagenUrl || "—"}
                  </td>
                  <td className="px-4 py-2">{p.category?.nombre ?? "Sin categoría"}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-400 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* --- MODAL --- */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editPost ? "Editar Post" : "Nuevo Post"}
        >
          <div className="flex flex-col space-y-3 text-white">
            <label>
              Título:
              <input
                type="text"
                placeholder="Ej. Cómo elegir tu fragancia ideal"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </label>

            <label>
              Categoría:
              <select
                value={categoria?.id ?? ""}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  const selected = categorias.find((c) => c.id === selectedId) ?? null;
                  setCategoria(selected);
                }}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
              >
                <option value="">-- Selecciona una categoría --</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Descripción:
              <input
                type="text"
                placeholder="Breve resumen del post"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </label>

            <label>
              Contenido:
              <textarea
                placeholder="Escribe el contenido completo aquí..."
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1 h-32"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
              />
            </label>

            <label>
              URL de Imagen:
              <input
                type="text"
                placeholder="https://..."
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
              />
            </label>

            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            >
              {editPost ? "Guardar cambios" : "Publicar Post"}
            </button>
          </div>
        </Modal>
      </div>
    </main>
  );
}
