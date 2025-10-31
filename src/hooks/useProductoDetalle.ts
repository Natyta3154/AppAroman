// src/hooks/useProductoDetalle.ts
import { useEffect, useState } from "react";
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
        const res = await fetch(`${API_BASE}/api/productos/${id}`);
        if (!res.ok) throw new Error("No se pudo obtener el producto");

        const data: Producto = await res.json();

       // console.log("Producto cargado:", data);
        setProducto(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  return { producto, loading, error };
}
