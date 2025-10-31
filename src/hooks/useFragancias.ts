// src/hooks/useFragancias.ts
import { useEffect, useState } from "react";
import type { Fragancias } from "../types/FraganciaCategoria";

export function useFragancias() {
  const [fragancias, setFragancias] = useState<Fragancias[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFragancias = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/fragancias/listar`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al obtener las fragancias");
      const data = await res.json();
      setFragancias(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las fragancias");
    } finally {
      setLoading(false);
    }
  };

  const createFragancia = async (nombre: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/fragancias/agregar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al crear la fragancia");
    await fetchFragancias();
  };

  const updateFragancia = async (id: number, nombre: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/fragancias/editar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al actualizar la fragancia");
    await fetchFragancias();
  };

  const deleteFragancia = async (id: number) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/fragancias/eliminarFragancias/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al eliminar la fragancia");
    await fetchFragancias();
  };

  useEffect(() => {
    fetchFragancias();
  }, []);

  return {
    fragancias,
    loading,
    error,
    createFragancia,
    updateFragancia,
    deleteFragancia,
    refetch: fetchFragancias,
  };
}
