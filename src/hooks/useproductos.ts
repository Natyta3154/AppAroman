// src/hooks/useProductos.ts
import { useState, useEffect } from "react";
import type { Producto } from "../types/producto";

// Tomamos la URL base de la API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Hook personalizado para manejar la carga, paginación y estado de los productos.
 *
 * @returns Un objeto con los productos, estado de carga, errores, página actual,
 *          bandera de más productos disponibles y función para recargar productos.
 */
export const useProductos = () => {
  // =========================
  // Estados internos del hook
  // =========================

  const [productos, setProductos] = useState<Producto[]>([]); // Lista de productos cargados
  const [loading, setLoading] = useState(false);              // Indica si se está cargando la data
  const [error, setError] = useState<string | null>(null);    // Mensaje de error si ocurre algún fallo
  const [page, setPage] = useState(0);                        // Página actual de paginación
  const [hasMore, setHasMore] = useState(true);               // Bandera para saber si hay más páginas disponibles

  // =========================
  // Función para obtener productos desde la API
  // =========================
  const fetchProductos = async (newPage = 0) => {
    setLoading(true);  // Activamos indicador de carga
    setError(null);    // Limpiamos errores previos

    try {
      // Construimos la URL de la petición con paginación
      const res = await fetch(
        `${API_URL}/api/productos/resumen?page=${newPage}&size=12`
      );

      // Si la respuesta no es 200 OK, lanzamos error
      if (!res.ok) throw new Error("Error al obtener productos");

      // Parseamos la respuesta JSON
      const data = await res.json();
      console.log("Respuesta cruda de la API:", data);
      // El backend devuelve Page<ProductoResumenDTO> con estructura { content: Producto[], last: boolean, ... }
      const nuevosProductos: Producto[] = data.content || data;

      // Actualizamos el estado de productos
      // Si es la primera página reemplazamos el array, si es paginación añadimos al final
      setProductos((prev) => (newPage === 0 ? nuevosProductos : [...prev, ...nuevosProductos]));

      // Controlamos paginación:
      // - data.last indica si es la última página
      // - nuevosProductos.length > 0 asegura que haya productos en la respuesta
      setHasMore(!data.last && nuevosProductos.length > 0);

      // Actualizamos la página actual
      setPage(newPage);
    } catch (err: any) {


      // Mostramos error en consola para debugging
      console.error("Error al cargar productos:", err);

      // Guardamos un mensaje amigable para mostrar en la UI
      setError("No se pudieron cargar los productos.");
    } finally {
      // Terminamos el indicador de carga
      setLoading(false);
    }
  };

  // =========================
  // Efecto de carga inicial
  // =========================
  useEffect(() => {
    // Al montar el hook, cargamos la primera página (0)
    fetchProductos(0);
  }, []);

  // =========================
  // Retorno del hook
  // =========================
  return {
    productos,      // Lista de productos
    loading,        // Indicador de carga
    error,          // Mensaje de error si ocurrió alguno
    page,           // Página actual
    hasMore,        // Flag para saber si hay más páginas
    fetchProductos  // Función para recargar o paginar productos
  };
};

