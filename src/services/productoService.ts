import type { Producto } from "../types/producto";

const API_URL = "http://localhost:8080/productos";

export const productosService = {
  getAll: async (): Promise<Producto[]> => {
    const res = await fetch(`${API_URL}/resumen`, { credentials: "include" });
    if (!res.ok) throw new Error("Error al obtener productos");
    const data = await res.json();
    return data.content || data;
  },

  getById: async (id: number | string): Promise<Producto> => {
    const res = await fetch(`${API_URL}/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Error al obtener producto");
    return res.json();
  },

  create: async (producto: Omit<Producto, "id">): Promise<Producto> => {
    const res = await fetch(`${API_URL}/agregar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al crear producto");
    return res.json();
  },

  update: async (id: number, producto: Partial<Producto>): Promise<Producto> => {
    const res = await fetch(`${API_URL}/editar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al actualizar producto");
    return res.json();
  },

  remove: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/eliminar/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al eliminar producto");
  },
};
