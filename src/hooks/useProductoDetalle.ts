// src/hooks/useProductoDetalle.ts
import { useEffect, useState } from "react";
import axios from "axios";
import type { Producto } from "../types/producto";

export function useProductoDetalle(id: string | undefined) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;

    const fetchProducto = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Producto>(`${API_BASE}/api/productos/${id}`, {
          //withCredentials: true,
        });

        setProducto(data);
      } catch (err: any) {
        console.error("Error al cargar producto:", err);
        setError(err.message || "No se pudo obtener el producto");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  return { producto, loading, error };
}
