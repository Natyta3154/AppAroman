// src/hooks/useProductosRelacionados.ts
import { useState, useEffect } from "react";
import api from "../utils/api";
import type { Producto } from "../types/producto";


export const useProductosRelacionados = (categoriaId?: number, excludeId?: number) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoriaId) return;

    const fetchRelacionados = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<Producto[]>(
          `/api/productos/relacionados`,
          {
            params: { categoriaId, excludeId },
            withCredentials: true,
          }
        );

        setProductos(data || []);
      } catch (err: any) {
        console.error("Error al cargar productos relacionados:", err);
        setError("No se pudieron cargar los productos relacionados.");
      } finally {
        setLoading(false);
      }
    };

    fetchRelacionados();
  }, [categoriaId, excludeId]);

  return { productos, loading, error };
};
