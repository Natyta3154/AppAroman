// src/hooks/useDestacados.ts
import { useEffect, useState } from "react";
import axios from "axios";
import type { ProductoDestacadoSimple } from "../types/productoDestacado";

const API_BASE = import.meta.env.VITE_API_URL;

export const useDestacados = () => {
  const [destacados, setDestacados] = useState<ProductoDestacadoSimple[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriaId = 3; // o la que corresponda
const { data } = await axios.get(`${API_BASE}/api/productos/top5/${categoriaId}`, {
          //withCredentials: true,
        });

        setDestacados(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchDestacados();
  }, []);

  return { destacados, loading, error };
};
