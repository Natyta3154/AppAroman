// src/services/productosService.ts
import type { Producto } from "../types/producto";

let productos: Producto[] = [
  { id: 1, nombre: "Camiseta", precio: 25, stock: 10, ofertas: true, descuento: 20 },
  { id: 2, nombre: "Pantalón", precio: 40, stock: 5, ofertas: false, descuento: 0 },
];

export const productosService = {
  getAll: async (): Promise<Producto[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...productos]), 300));
  },

  remove: async (id: number): Promise<void> => {
    productos = productos.filter(p => p.id !== id);
    return new Promise(resolve => setTimeout(resolve, 200));
  },

  create: async (producto: Omit<Producto, "id">): Promise<Producto> => {
    const newProduct = { ...producto, id: Math.max(...productos.map(p => p.id)) + 1 };
    productos.push(newProduct);
    return new Promise(resolve => setTimeout(() => resolve(newProduct), 200));
  },

  update: async (id: number, producto: Partial<Producto>): Promise<Producto> => {
    productos = productos.map(p => (p.id === id ? { ...p, ...producto } : p));
    const updated = productos.find(p => p.id === id)!;
    return new Promise(resolve => setTimeout(() => resolve(updated), 200));
  },
};
