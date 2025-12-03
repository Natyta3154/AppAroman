import { useEffect, useState } from "react";
import { usePosts } from "../hooks/usePosts";
import type { Post, CategoriaPost } from "../types/post";
import Modal from "./Modal";
import toast from "react-hot-toast";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export default function PostBlog() {
  const { posts, cargando, error, crearPost, actualizarPost, eliminarPost } =
    usePosts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [categorias, setCategorias] = useState<CategoriaPost[]>([]);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [categoria, setCategoria] = useState<CategoriaPost | null>(null);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await axios.get<CategoriaPost[]>(
          `${API_BASE}/api/categorias-blog/listarCategoriaBlog`,
          { withCredentials: true }
        );
        setCategorias(res.data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudieron cargar las categorías ❌");
      }
    }
    fetchCategorias();
  }, []);

  const handleCreate = () => {
    setEditPost(null);
    setTitulo("");
    setDescripcion("");
    setContenido("");
    setImagenUrl("");
    setCategoria(null);
    setModalOpen(true);
  };

  const handleEdit = (p: Post) => {
    setEditPost(p);
    setTitulo(p.titulo ?? "");
    setDescripcion(p.descripcion ?? "");
    setContenido(p.contenido ?? "");
    setImagenUrl(p.imagenUrl ?? "");
    setCategoria(p.categoria ?? null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!titulo.trim() || !descripcion.trim())
      return toast.error("El título y la descripción son obligatorios ❗");

    const payload = {
      titulo,
      descripcion,
      contenido,
      imagenUrl,
      categorias: categoria ? { id: categoria.id } : null,
    };

    try {
      if (editPost) {
        await actualizarPost(editPost.id, payload);
        toast.success("Post actualizado");
      } else {
        await crearPost(payload);
        toast.success("Post creado");
      }

      setModalOpen(false);
      setEditPost(null);
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar ❌");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este post?")) return;
    try {
      await eliminarPost(id);
      toast.success("Post eliminado");
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar ❌");
    }
  };

  return (
    <main className="min-h-screen p-6 flex justify-center bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a]">
      <div
        className="
          w-full max-w-6xl
          p-6
          bg-white/20 backdrop-blur-xl
          rounded-3xl shadow-xl
          border border-white/30
        "
      >
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-8">
          📚 Administrar Posts del Blog
        </h2>

        {/* Botón crear */}
        <div className="flex justify-center mb-8">
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
            ➕ Nuevo Post
          </button>
        </div>

        {cargando ? (
          <p className="text-center text-purple-900 font-semibold">
            Cargando posts...
          </p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <div
                key={p.id}
                className="
                  bg-white/30 backdrop-blur-lg
                  rounded-2xl p-4 shadow-lg 
                  border border-white/20
                  hover:shadow-xl transition-all
                  flex flex-col space-y-3
                "
              >
                <img
                  src={p.imagenUrl || 'https://via.placeholder.com/300'}
                  alt={p.titulo}
                  className="w-full h-40 object-cover rounded-lg"
                />

                <h3 className="text-xl font-bold text-purple-900">
                  {p.titulo}
                </h3>

                <p className="text-gray-800 text-sm line-clamp-2">
                  {p.descripcion}
                </p>

                <p className="text-xs text-purple-900">
                  Categoría:{" "}
                  <span className="font-semibold">
                    {p.categoria?.nombre ?? "—"}
                  </span>
                </p>

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => handleEdit(p)}
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
                    onClick={() => handleDelete(p.id)}
                    className="
                      px-3 py-1 rounded-full
                      bg-red-500 text-white 
                      hover:bg-red-400 
                      transition-all shadow
                    "
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editPost ? "Editar Post" : "Nuevo Post"}
        >
          <div className="flex flex-col space-y-3 text-gray-900">
            <label>
              <span className="font-semibold">Título:</span>
              <input
                type="text"
                className="
                  w-full px-3 py-2 rounded
                  bg-white/30 backdrop-blur-lg
                  border border-white/40
                "
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </label>

            <label>
              <span className="font-semibold">Categoría:</span>
              <select
                value={categoria?.id ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setCategoria(categorias.find((c) => c.id === id) ?? null);
                }}
                className="
                  w-full px-3 py-2 rounded
                  bg-white/30 backdrop-blur-lg
                  border border-white/40
                "
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
              <span className="font-semibold">Descripción:</span>
              <input
                type="text"
                className="
                  w-full px-3 py-2 rounded
                  bg-white/30 backdrop-blur-lg
                  border border-white/40
                "
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </label>

            <label>
              <span className="font-semibold">Contenido:</span>
              <textarea
                className="
                  w-full px-3 py-2 rounded h-32
                  bg-white/30 backdrop-blur-lg
                  border border-white/40
                "
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
              />
            </label>

            <label>
              <span className="font-semibold">URL de imagen:</span>
              <input
                type="text"
                className="
                  w-full px-3 py-2 rounded
                  bg-white/30 backdrop-blur-lg
                  border border-white/40
                "
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
              />
            </label>

            <button
              onClick={handleSave}
              className="
                mt-4 px-4 py-2 rounded-full
                bg-gradient-to-r from-purple-600 to-pink-500
                text-white shadow-md hover:shadow-xl
                transition-all
              "
            >
              {editPost ? "Guardar cambios" : "Publicar Post"}
            </button>
          </div>
        </Modal>
      </div>
    </main>
  );
}
