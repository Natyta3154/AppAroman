// src/services/pedidosService.ts
import type { Pedido } from "../types/pedido";

let pedidos: Pedido[] = [
  { id: 1, cliente: "Juan Perez", total: 65, estado: "Pendiente", fecha: new Date().toISOString() },
  { id: 2, cliente: "Maria Lopez", total: 40, estado: "Enviado", fecha: new Date().toISOString() },
];

export const pedidosService = {
  getAll: async (): Promise<Pedido[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...pedidos]), 300));
  },

  remove: async (id: number): Promise<void> => {
    pedidos = pedidos.filter(p => p.id !== id);
    return new Promise(resolve => setTimeout(resolve, 200));
  },

  create: async (pedido: Omit<Pedido, "id">): Promise<Pedido> => {
    const newPedido = { ...pedido, id: Math.max(...pedidos.map(p => p.id)) + 1 };
    pedidos.push(newPedido);
    return new Promise(resolve => setTimeout(() => resolve(newPedido), 200));
  },

  update: async (id: number, pedido: Partial<Pedido>): Promise<Pedido> => {
    pedidos = pedidos.map(p => (p.id === id ? { ...p, ...pedido } : p));
    const updated = pedidos.find(p => p.id === id)!;
    return new Promise(resolve => setTimeout(() => resolve(updated), 200));
  },
};
