// src/hooks/useDestacados.ts
import { useEffect, useState } from "react";
import type { ProductoDestacadoSimple } from "../types/productoDestacado";

const API_BASE = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL;


export const useDestacados = () => {
  const [destacados, setDestacados] = useState<ProductoDestacadoSimple[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/api/productos/top5`); // tu endpoint
        if (!response.ok) throw new Error("Error al cargar productos destacados");

        const data: ProductoDestacadoSimple[] = await response.json();
        setDestacados(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchDestacados();
  }, []);

  return { destacados, loading, error };
};
