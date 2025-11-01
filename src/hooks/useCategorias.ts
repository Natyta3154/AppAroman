// src/hooks/useCategorias.ts
import { useEffect, useState } from "react";
import type { Categorias } from "../types/FraganciaCategoria";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/categorias/listar`, 
        /*{ withCredentials: true });*/);
      setCategorias(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  const createCategoria = async (nombre: string) => {
    try {
      await axios.post(`${API_BASE}/api/categorias/agregar`, { nombre }, { withCredentials: true });
      await fetchCategorias();
    } catch (err) {
      console.error(err);
      throw new Error("Error al crear la categoría");
    }
  };

  const updateCategoria = async (id: number, nombre: string) => {
    try {
      await axios.put(`${API_BASE}/api/categorias/editar/${id}`, { nombre }, { withCredentials: true });
      await fetchCategorias();
    } catch (err) {
      console.error(err);
      throw new Error("Error al actualizar la categoría");
    }
  };

  const deleteCategoria = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/api/categorias/eliminar/${id}`, { withCredentials: true });
      await fetchCategorias();
    } catch (err) {
      console.error(err);
      throw new Error("Error al eliminar la categoría");
    }
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
