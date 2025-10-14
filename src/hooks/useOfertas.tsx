import { useState, useEffect } from "react";
import axios from "axios";

// Definimos la interfaz del producto de oferta
export interface ProductoOferta {
  id: number;
  nombre: string;
  imagenUrl?: string;
  precioOriginal: number;
  precioConDescuento: number;
  fechaInicio?: string;
  fechaFin?: string;
}

const API_BASE = import.meta.env.VITE_API_URL;

export function useOfertas(limite: number = 5) {
  const [ofertas, setOfertas] = useState<ProductoOferta[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOfertas() {
      try {
        setCargando(true);
        setError(null);

       const response = await axios.get<ProductoOferta[]>(`${API_BASE}/api/ofertas/carrusel`);

        setOfertas(response.data);
      } catch (err) {
        console.error("Error al cargar las ofertas:", err);
        setError("No se pudo cargar las ofertas");
      } finally {
        setCargando(false);
      }
    }

    fetchOfertas();
  }, [limite]);

  return { ofertas, cargando, error };
}
