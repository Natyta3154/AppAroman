import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import type {Post } from "../types/post";



export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Obtener todos los posts ---
  const fetchPosts = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await api.get<Post[]>(`/api/posts/listarPost`, {
        //withCredentials: true,
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error al obtener posts:", err);
      setError("No se pudo cargar los posts");
    } finally {
      setCargando(false);
    }
  }, []);

  // --- Crear un nuevo post ---
  const crearPost = useCallback(async (postData: Partial<Post>) => {
    try {
      const res = await api.post(`/api/posts/agregarPost`, postData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setPosts(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Error al crear post:", err);
      throw err;
    }
  }, []);

  // --- Actualizar post ---
  const actualizarPost = useCallback(async (id: number, postData: Partial<Post>) => {
    try {
      const res = await api.put(`/api/posts/actualizarPost/${id}`, postData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setPosts(prev => prev.map(p => (p.id === id ? res.data : p)));
    } catch (err) {
      console.error("Error al actualizar post:", err);
      throw err;
    }
  }, []);

  // --- Eliminar post ---
  const eliminarPost = useCallback(async (id: number) => {
    try {
      await api.delete(`/api/posts/eliminar/${id}`, {
        withCredentials: true,
      });
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar post:", err);
      throw err;
    }
  }, []);

  // --- Cargar los posts al montar ---
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    cargando,
    error,
    fetchPosts,
    crearPost,
    actualizarPost,
    eliminarPost,
  };
}
