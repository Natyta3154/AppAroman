import { create } from "zustand";

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}

interface CartState {
  cart: Producto[];
  addToCart: (producto: Producto) => void; // 🔹 debe existir
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (producto) =>
    set((state) => ({ cart: [...state.cart, producto] })),
  removeFromCart: (id) =>
    set((state) => ({ cart: state.cart.filter((p) => p.id !== id) })),
  clearCart: () => set({ cart: [] }),
}));
