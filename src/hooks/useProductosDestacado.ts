// src/hooks/useDestacados.ts
import { useEffect, useState } from "react";
import type { ProductoDestacadoSimple } from "../types/productoDestacado";

export const useDestacados = () => {
  const [destacados, setDestacados] = useState<ProductoDestacadoSimple[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/productos/destacados"); // tu endpoint
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
