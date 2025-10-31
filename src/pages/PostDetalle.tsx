import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import type { Post } from "../types/post";

const API_BASE = import.meta.env.VITE_API_URL;


const PostDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!id) return;

    axios.get<Post>(`${API_BASE}/api/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error("Error al cargar el post:", err));
  }, [id]);

  if (!post) return <p className="text-center mt-10">Cargando post...</p>;

  return (
        <main className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-200 py-20 px-4">

    <div className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="text-4xl font-bold mb-6">{post.titulo}</h1>
      <img
        src={post.imagenUrl}
        alt={post.titulo}
        className="w-full h-96 object-cover rounded-2xl mb-6"
      />
      <p className="text-gray-700 mb-4">{post.contenido || post.descripcion}</p>
      {post.category && (
        <span className="text-sm text-gray-500">Categoría: {post.category.nombre}</span>
      )}
    </div>
        </main>
  );
};

export default PostDetalle;
