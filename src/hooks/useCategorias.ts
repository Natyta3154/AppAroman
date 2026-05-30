// src/hooks/useCategorias.ts
import { useEffect, useState } from "react";
import type { Categorias } from "../types/FraganciaCategoria";
import api from "../utils/api";


export function useCategorias() {
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`//api/categoria/listadoCat`, 
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
      await api.post(`//api/categoria/agregar`, { nombre }, { withCredentials: true });
      await fetchCategorias();
    } catch (err) {
      console.error(err);
      throw new Error("Error al crear la categoría");
    }
  };

  const updateCategoria = async (id: number, nombre: string) => {
    try {
      await api.put(`//api/categoria/editar/${id}`, { nombre }, { withCredentials: true });
      await fetchCategorias();
    } catch (err) {
      console.error(err);
      throw new Error("Error al actualizar la categoría");
    }
  };

  const deleteCategoria = async (id: number) => {
    try {
      await api.delete(`//api/categoria/eliminar/${id}`, { withCredentials: true });
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
