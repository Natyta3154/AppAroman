// src/hooks/useProductos.ts
import { useState, useEffect } from "react";
import api from "../utils/api";
import type { Producto } from "../types/producto";


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
      const { data } = await api.get(`//api/productos/resumen?page=${newPage}&size=12`, {
       // withCredentials: true,
      });
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
      const { data } = await api.get(`//api/productos/listado`, {
        //withCredentials: true,
      });
      setProductos(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos (admin).");
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: number | string): Promise<Producto> => {
    const { data } = await api.get(`//api/productos/${id}`, 
      { withCredentials: true });
    return data;
  };

  const createProducto = async (producto: Omit<Producto, "id">): Promise<Producto> => {
    const { data } = await api.post(`//api/productos/agregar`, producto, { withCredentials: true });
    setProductos(prev => [...prev, data]);
    return data;
  };

  const updateProducto = async (id: number, producto: Partial<Producto>): Promise<Producto> => {
    const { data } = await api.put(`//api/productos/editar/${id}`, producto, { withCredentials: true });
    setProductos(prev => prev.map(p => (p.id === id ? data : p)));
    return data;
  };

  const removeProducto = async (id: number) => {
    await api.delete(`//api/productos/eliminar/${id}`, { withCredentials: true });
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  // =========================
  // FUNCIONES PARA SELECTS
  // =========================

  const fetchCategorias = async () => {
    const { data } = await api.get(`//api/categoria/listadoCat`, { withCredentials: false });
    setCategorias(data);
  };

  const fetchFragancias = async () => {
    const { data } = await api.get(`//api/fragancias/listadoFragancias`, { withCredentials: false });
    setFragancias(data);
  };

  const fetchAtributos = async () => {
    const { data } = await api.get(`//api/atributos/listadoAtributos`, { withCredentials: false });
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
