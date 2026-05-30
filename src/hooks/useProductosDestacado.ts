import { useEffect, useState } from "react";
import api from "../utils/api";
import type { ProductoDestacadoSimple } from "../types/productoDestacado";


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
        const { data } = await api.get<ProductoDestacadoSimple[]>(
          `/api/productos/top5`
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
