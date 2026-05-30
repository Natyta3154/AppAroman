// src/hooks/usePedidos.ts
import { useState, useEffect } from "react";
import type { Pedido } from "../types/pedido";
import api from "../utils/api";


export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cargar pedidos
  const fetchPedidos = async () => {
    try {
      setCargando(true);
      const res = await api.get<Pedido[]>(`/pedidos`, { withCredentials: true });
      setPedidos(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los pedidos");
    } finally {
      setCargando(false);
    }
  };

  // 🔹 Crear pedido
  const createPedido = async (pedido: Omit<Pedido, "id">) => {
    try {
      const res = await api.post<Pedido>(`/pedidos`, pedido, { withCredentials: true });
      setPedidos(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error(err);
      throw new Error("Error al crear el pedido");
    }
  };

  // 🔹 Actualizar pedido
  const updatePedido = async (id: number, pedido: Partial<Pedido>) => {
    try {
      const res = await api.put<Pedido>(`/pedidos/${id}`, pedido, { withCredentials: true });
      setPedidos(prev => prev.map(p => (p.id === id ? res.data : p)));
      return res.data;
    } catch (err) {
      console.error(err);
      throw new Error("Error al actualizar el pedido");
    }
  };

  // 🔹 Eliminar pedido
  const removePedido = async (id: number) => {
    try {
      await api.delete(`//pedidos/${id}`, { withCredentials: true });
      setPedidos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      throw new Error("Error al eliminar el pedido");
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return { pedidos, cargando, error, fetchPedidos, createPedido, updatePedido, removePedido };
}
