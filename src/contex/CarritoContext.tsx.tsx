// src/context/CarritoContext.tsx
import { createContext, useContext, useState, useEffect} from "react";
import type { ReactNode } from "react";
import type { Producto } from "../types/producto";

interface CarritoContextType {
  carrito: Producto[];
  agregarProducto: (p: Producto) => void;
  eliminarProducto: (id: number) => void;
  incrementar: (id: number) => void;
  decrementar: (id: number) => void;
  total: number;
  isOpen: boolean;
  toggleCart: () => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("carrito") || "[]");
    setCarrito(saved);
  }, []);

  const guardar = (nuevo: Producto[]) => {
    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
  };

  const agregarProducto = (p: Producto) => {
    const existe = carrito.find(item => item.id === p.id);
    if (existe) {
      incrementar(p.id);
    } else {
      guardar([...carrito, { ...p, quantity: 1 }]);
    }
  };

  const eliminarProducto = (id: number) => {
    guardar(carrito.filter(p => p.id !== id));
  };

  const incrementar = (id: number) => {
    guardar(
      carrito.map(p => (p.id === id ? { ...p, quantity: (p.quantity || 1) + 1 } : p))
    );
  };

  const decrementar = (id: number) => {
    guardar(
      carrito.map(p =>
        p.id === id && (p.quantity || 1) > 1 ? { ...p, quantity: (p.quantity || 1) - 1 } : p
      )
    );
  };

  const total = carrito.reduce(
    (acc, p) => acc + (p.precioFinal ?? p.precio) * (p.quantity || 1),
    0
  );

  const toggleCart = () => setIsOpen(!isOpen);

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarProducto, eliminarProducto, incrementar, decrementar, total, isOpen, toggleCart }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return context;
};
