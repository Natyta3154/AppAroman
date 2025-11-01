// src/hooks/useCategoriasPost.ts
import { useState, useEffect } from "react";
import type { CategoriaPost } from "../types/post";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export function useCategoriasPost() {
  const [categorias, setCategorias] = useState<CategoriaPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // Cargar todas las categorías
  // =========================
  const fetchCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<CategoriaPost[]>(`${API_BASE}/api/categorias-blog/listarCategoriaBlog`, 
        { withCredentials: true });
      setCategorias(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Crear categoría
  // =========================
  const createCategoria = async (data: { nombre: string; descripcion?: string }) => {
    try {
      const { data: nueva } = await axios.post<CategoriaPost>(
        `${API_BASE}/api/categorias-blog/agregarCategoriaBlog`,
        data,
        { withCredentials: true }
      );
      setCategorias(prev => [...prev, nueva]);
      return nueva;
    } catch (err) {
      console.error(err);
      throw new Error("Error al crear categoría");
    }
  };

  // =========================
  // Actualizar categoría
  // =========================
  const updateCategoria = async (id: number, data: { nombre: string; descripcion?: string }) => {
    try {
      const { data: updated } = await axios.put<CategoriaPost>(
        `${API_BASE}/api/categorias-blog/${id}`,
        data,
        { withCredentials: true }
      );
      setCategorias(prev => prev.map(c => (c.id === id ? updated : c)));
      return updated;
    } catch (err) {
      console.error(err);
      throw new Error("Error al actualizar categoría");
    }
  };

  // =========================
  // Eliminar categoría
  // =========================
  const deleteCategoria = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/api/categorias-blog/${id}`, { withCredentials: true });
      setCategorias(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      throw new Error("Error al eliminar categoría");
    }
  };

  // =========================
  // Efecto inicial
  // =========================
  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias,
    loading,
    error,
    fetchCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
  };
}
