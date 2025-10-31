// src/hooks/useCategorias.ts
import { useEffect, useState } from "react";
import type { Categorias } from "../types/FraganciaCategoria";


const API_BASE = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL;


export function useCategorias() {
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/categorias/listar`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al obtener las categorías");
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  const createCategoria = async (nombre: string) => {
    const res = await fetch(`${API_BASE}/api/categorias/agregar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al crear la categoría");
    await fetchCategorias();
  };

  const updateCategoria = async (id: number, nombre: string) => {
    const res = await fetch(`${API_BASE}/api/categorias/editar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al actualizar la categoría");
    await fetchCategorias();
  };

  const deleteCategoria = async (id: number) => {
    const res = await fetch(`${API_BASE}/api/categorias/eliminar/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al eliminar la categoría");
    await fetchCategorias();
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias,
    loading,
    error,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    refetch: fetchCategorias,
  };
}
