// src/hooks/useProductos.ts
import { useState, useEffect } from "react";
import type { Producto } from "../types/producto";

const API_BASE = import.meta.env.VITE_API_URL;


export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Para selects en admin
  const [categorias, setCategorias] = useState<{ id: number; nombre: string; descripcion: string }[]>([]);
  const [fragancias, setFragancias] = useState<{ id: number; nombre: string }[]>([]);
  const [atributos, setAtributos] = useState<{ nombre: string }[]>([]);

  // =========================
  // FUNCIONES CRUD
  // =========================

  const fetchProductos = async (newPage = 0) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/productos/resumen?page=${newPage}&size=12`, { credentials: "include" });
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      const nuevosProductos: Producto[] = data.content || data;

      setProductos(prev => (newPage === 0 ? nuevosProductos : [...prev, ...nuevosProductos]));
      setHasMore(!data.last && nuevosProductos.length > 0);
      setPage(newPage);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductosAdmin = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/productos/listado`, { credentials: "include" });
      if (!res.ok) throw new Error("Error al obtener productos (admin)");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos (admin).");
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: number | string): Promise<Producto> => {
    const res = await fetch(`${API_BASE}/api/productos/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Error al obtener producto");
    return res.json();
  };

  const createProducto = async (producto: Omit<Producto, "id">): Promise<Producto> => {
    const res = await fetch(`${API_BASE}/api/productos/agregar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al crear producto");
    const data = await res.json();
    setProductos(prev => [...prev, data]);
    return data;
  };

  const updateProducto = async (id: number, producto: Partial<Producto>): Promise<Producto> => {
    const res = await fetch(`${API_BASE}/api/productos/editar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al actualizar producto");
    const data = await res.json();
    setProductos(prev => prev.map(p => (p.id === id ? data : p)));
    return data;
  };

  const removeProducto = async (id: number) => {
    const res = await fetch(`${API_BASE}/api/productos/eliminar/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) throw new Error("Error al eliminar producto");
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  // =========================
  // FUNCIONES PARA SELECTS
  // =========================

  const fetchCategorias = async () => {
    const res = await fetch(`${API_BASE}/api/categorias/listado`, { credentials: "include" });
    if (!res.ok) throw new Error("Error al obtener categorías");
    const data = await res.json();
    setCategorias(data);
  };

  const fetchFragancias = async () => {
    const res = await fetch(`${API_BASE}/api/fragancias/listadoFragancias`, { credentials: "include" });
    if (!res.ok) throw new Error("Error al obtener fragancias");
    const data = await res.json();
    setFragancias(data);
  };

  const fetchAtributos = async () => {
    const res = await fetch(`${API_BASE}/api/atributos/listadoAtributos`, { credentials: "include" });
    if (!res.ok) throw new Error("Error al obtener atributos");
    const data = await res.json();
    setAtributos(data);
  };

  // =========================
  // EFECTOS
  // =========================

  useEffect(() => {
    fetchProductos(0);
    fetchCategorias();
    fetchFragancias();
    fetchAtributos();
  }, []);

  return {
    productos,
    loading,
    error,
    page,
    hasMore,
    fetchProductos,
    fetchProductosAdmin,
    getById,
    createProducto,
    updateProducto,
    removeProducto,
    categorias,
    fragancias,
    atributos,
    fetchCategorias,
    fetchFragancias,
    fetchAtributos,
  };
}

