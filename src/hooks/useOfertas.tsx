import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { TipoDescuento, Oferta } from "../types/producto";

const API_BASE = import.meta.env.VITE_API_URL;


export function useOfertas(
  limite: number = 5,
  modo: "carrusel" | "admin" | "precios" = "carrusel"
) {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // 🔹 Función para mapear los datos del backend a Oferta
  // =========================
  const mapToOferta = (o: any): Oferta => {
  // Preferir los campos que vienen del backend
  const precioOriginal = Number(o.precioOriginal ?? o.precio ?? 0);
  const precioConDescuento = Number(
    o.precioConDescuento ?? o.precioDescuento ?? o.precioFinal ?? precioOriginal
  );

  // Si el backend no manda valorDescuento, lo calculamos nosotros
  const valorDescuento =
    o.valorDescuento ??
    (precioOriginal > 0
      ? Number(((1 - precioConDescuento / precioOriginal) * 100).toFixed(2))
      : 0);

  const tipoDescuento: TipoDescuento =
    o.tipoDescuento ?? (valorDescuento > 0 ? "PORCENTAJE" : "MONTO");

  return {
    idOferta: o.idOferta ?? o.id ?? 0,
    productoId: o.productoId ?? o.id ?? 0,
    nombreProducto: o.nombreProducto || o.nombre || "Producto sin nombre",
    descripcion: o.descripcion ?? null,
    precio: precioOriginal,
    valorDescuento,
    tipoDescuento,
    fechaInicio: o.fechaInicio || "",
    fechaFin: o.fechaFin || "",
    estado: o.estado ?? true,
    precioConDescuento,
    imagenUrl: o.imagenUrl || o.imagen || o.foto || "/placeholder.png",
  };
};


  // =========================
  // 🔹 Obtener ofertas del carrusel (solo activas y limitadas)
  // =========================
  const fetchOfertasCarrusel = useCallback(async () => {
    try {
      setCargando(true);
      const { data } = await axios.get<any[]>(
        `${API_BASE}/api/ofertas/carrusel?limite=${limite}`,
        { withCredentials: true }
      );
      setOfertas(data.map(mapToOferta));
      setError(null);
    } catch (err) {
      console.error("Error al cargar las ofertas del carrusel:", err);
      setError("No se pudieron cargar las ofertas del carrusel");
    } finally {
      setCargando(false);
    }
  }, [limite]);

  // =========================
  // 🔹 Obtener todas las ofertas (para panel admin)
  // =========================
  const fetchOfertas = useCallback(async () => {
    try {
      setCargando(true);
      const { data } = await axios.get<any[]>(`${API_BASE}/api/ofertas/listar`, {
        withCredentials: true,
      });
      setOfertas(data.map(mapToOferta));
      setError(null);
    } catch (err) {
      console.error("Error al listar las ofertas:", err);
      setError("No se pudieron listar las ofertas");
    } finally {
      setCargando(false);
    }
  }, []);

  // =========================
  // 🔹 Obtener productos con precio final aplicado
  // =========================
  const fetchOfertasConPrecio = useCallback(async () => {
    try {
      setCargando(true);
      const { data } = await axios.get<any[]>(`${API_BASE}/api/ofertas/con-precio`, {
        withCredentials: true,
      });
      setOfertas(data.map(mapToOferta));
      setError(null);
    } catch (err) {
      console.error("Error al cargar ofertas con precio final:", err);
      setError("No se pudieron cargar las ofertas con precio final");
    } finally {
      setCargando(false);
    }
  }, []);

  // =========================
  // 🔹 Crear / actualizar / eliminar
  // =========================
  const createOferta = useCallback(
    async (data: Partial<Oferta>) => {
      await axios.post(`${API_BASE}/api/ofertas/crearOferta`, data, {
        withCredentials: true,
      });
      await fetchOfertas();
    },
    [fetchOfertas]
  );

  const updateOferta = useCallback(
    async (id: number, data: Partial<Oferta>) => {
      await axios.put(`${API_BASE}/api/ofertas/editar/${id}`, data, {
        withCredentials: true,
      });
      await fetchOfertas();
    },
    [fetchOfertas]
  );

  const deleteOferta = useCallback(
    async (id: number) => {
      await axios.delete(`${API_BASE}/api/ofertas/eliminar/${id}`, {
        withCredentials: true,
      });
      await fetchOfertas();
    },
    [fetchOfertas]
  );

  // =========================
  // 🔹 Inicialización según modo
  // =========================
  useEffect(() => {
    if (modo === "carrusel") fetchOfertasCarrusel();
    else if (modo === "admin") fetchOfertas();
    else if (modo === "precios") fetchOfertasConPrecio();
  }, [modo, fetchOfertasCarrusel, fetchOfertas, fetchOfertasConPrecio]);

  return {
    ofertas,
    cargando,
    error,
    fetchOfertas,
    fetchOfertasConPrecio,
    fetchOfertasCarrusel,
    createOferta,
    updateOferta,
    deleteOferta,
    refetch:
      modo === "admin"
        ? fetchOfertas
        : modo === "precios"
        ? fetchOfertasConPrecio
        : fetchOfertasCarrusel,
  };
}
