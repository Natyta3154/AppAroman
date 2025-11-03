import { useEffect, useState } from "react";
import axios from "axios";
import type { ProductoDestacadoSimple } from "../types/productoDestacado";

const API_BASE = import.meta.env.VITE_API_URL;

export const useDestacados = () => {
  const [destacados, setDestacados] = useState<ProductoDestacadoSimple[]>([]);
  //console.log(destacados);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestacados = async () => {
      setLoading(true);
      setError(null);

      //const categoriaId = 5; // ID de la categoría que quieras mostrar
      try {
        const { data } = await axios.get<ProductoDestacadoSimple[]>(
          `${API_BASE}/api/productos/top5`
        );
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
