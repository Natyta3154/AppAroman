// src/hooks/useProductos.ts
import { useState, useEffect } from "react";
import type { Producto } from "../types/producto";




export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Función reutilizable para cargar productos paginados
  const fetchProductos = async (newPage = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8080/productos/resumen?page=${newPage}&size=12`
      );

      if (!res.ok) throw new Error("Error al obtener productos");

      const data = await res.json();

      // ✅ Manejo para cuando el backend devuelve un Page<>
      const nuevosProductos: Producto[] = data.content || data;

      // ✅ Calcular precio final según ofertas activas
      const hoy = new Date();
      const productosConOferta = nuevosProductos.map((p) => {
        let precioFinal = p.precio;

        const ofertaActiva = p.ofertas?.find((o) => {
          const inicio = new Date(o.fechaInicio ?? new Date());
          const fin = new Date(o.fechaFin ?? new Date());
          return o.estado && hoy >= inicio && hoy <= fin;
        });

        if (ofertaActiva) {
          if (ofertaActiva.tipoDescuento === "PORCENTAJE") {
            precioFinal = p.precio - (p.precio * (ofertaActiva.valorDescuento ?? 0)) / 100;
          } else if (ofertaActiva.tipoDescuento === "MONTO") {
            precioFinal = p.precio - (ofertaActiva.valorDescuento ?? 0);
          }
        }

        return { ...p, precioFinal };
      });

      // ✅ Si es la primera página, reemplaza. Si no, concatena.
      setProductos((prev) =>
        newPage === 0 ? productosConOferta : [...prev, ...productosConOferta]
      );

      // ✅ Controlar si hay más productos
      if (data.last || productosConOferta.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setPage(newPage);
    } catch (err: any) {
      console.error("Error al cargar productos:", err);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Carga inicial
  useEffect(() => {
    fetchProductos(0);
  }, []);

  return {
    productos,
    loading,
    error,
    page,
    hasMore,
    fetchProductos,
  };
};
