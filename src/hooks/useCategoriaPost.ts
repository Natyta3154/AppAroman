// src/hooks/useCategoriasPost.ts
import { useState, useEffect } from "react";

import type {CategoriaPost} from "../types/post";

const API_BASE = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL;



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
      const res = await fetch(`${API_BASE}/api/categorias-blog/listarCategoriaBlog`, { credentials: "include" });
      if (!res.ok) throw new Error("No se pudieron cargar las categorías");
      const data: CategoriaPost[] = await res.json();
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
    const res = await fetch(`${API_BASE}/api/categorias-blog/agregarCategoriaBlog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al crear categoría");
    const nueva: CategoriaPost = await res.json();
    setCategorias(prev => [...prev, nueva]);
    return nueva;
  };

  // =========================
  // Actualizar categoría
  // =========================
  const updateCategoria = async (id: number, data: { nombre: string; descripcion?: string }) => {
    const res = await fetch(`${API_BASE}/api/categorias-blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al actualizar categoría");
    const updated: CategoriaPost = await res.json();
    setCategorias(prev => prev.map(c => (c.id === id ? updated : c)));
    return updated;
  };

  // =========================
  // Eliminar categoría
  // =========================
  const deleteCategoria = async (id: number) => {
    const res = await fetch(`${API_BASE}/api/categorias-blog/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al eliminar categoría");
    setCategorias(prev => prev.filter(c => c.id !== id));
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
