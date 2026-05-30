import { useEffect, useState } from "react";
import api from "../utils/api";
import type { Fragancias } from "../types/FraganciaCategoria";


export function useFragancias() {
  const [fragancias, setFragancias] = useState<Fragancias[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFragancias = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/fragancias/listadoFragancias");
      setFragancias(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las fragancias");
    } finally {
      setLoading(false);
    }
  };

  const createFragancia = async (nombre: string) => {
    await api.post("/api/fragancias/agregarFragancia", { nombre });
    await fetchFragancias();
  };

  const updateFragancia = async (id: number, nombre: string) => {
    await api.put(`/api/fragancias/editarFragancia/${id}`, { nombre });
    await fetchFragancias();
  };

  const deleteFragancia = async (id: number) => {
    await api.delete(`/api/fragancias/eliminarFragancias/${id}`);
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
