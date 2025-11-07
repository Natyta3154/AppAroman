import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Producto } from "../types/producto";

interface CarritoContextType {
  carrito: Producto[];
  agregarProducto: (p: Producto | any) => void;
  eliminarProducto: (id: number) => void;
  incrementar: (id: number) => void;
  decrementar: (id: number) => void;
  total: number; // total con descuento
  totalSinDescuento: number;
  totalDescuento: number;
  isOpen: boolean;
  toggleCart: () => void;
  limpiarCarrito: () => void;
  agregarAlCarrito: (p: Producto | any) => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // ===============================
  // 🔹 Cargar desde localStorage al iniciar
  // ===============================
  useEffect(() => {
    try {
      const saved = localStorage.getItem("carrito");
      if (saved) setCarrito(JSON.parse(saved));
    } catch (err) {
      console.error("Error al cargar carrito:", err);
      localStorage.removeItem("carrito");
    }
  }, []);

  // ✅ Guardar en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // ===============================
  // 🔹 Funciones auxiliares
  // ===============================

  const guardar = (nuevo: Producto[]) => {
    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
    sessionStorage.setItem("carrito", JSON.stringify(nuevo));
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem("carrito");
    sessionStorage.removeItem("carrito");
  };

  // 🔹 Adaptar una oferta a un producto compatible
  const adaptarOfertaAProducto = (o: any): Producto => ({
    id: o.productoId ?? o.idOferta ?? o.id ?? 0,
    nombre: o.nombreProducto ?? o.nombre ?? "Producto sin nombre",
    descripcion: o.descripcion ?? "",
    precio: o.precio ?? o.precioOriginal ?? 0,
    precioMayorista: o.precioMayorista ?? 0,
    precioOriginal: o.precioOriginal ?? o.precio ?? 0,
    precioConDescuento: o.precioConDescuento ?? o.precioFinal ?? o.precio ?? 0,
    precioFinal: o.precioConDescuento ?? o.precioFinal ?? o.precio ?? 0,
    totalIngresado: 0,
    stock: o.stock ?? 0,
    imagenUrl: o.imagenUrl ?? o.imagen ?? "/placeholder.png",
    activo: true,
    categoriaId: o.categoriaId ?? 0,
    categoriaNombre: o.categoriaNombre ?? "Sin categoría",
    mensaje: null,
    fragancias: o.fragancias ?? [],
    atributos: o.atributos ?? [],
    ofertas: [],
    destacado: o.destacado ?? false,
    quantity: 1,
  });

  // ===============================
  // 🔹 Operaciones principales
  // ===============================

  const agregarProducto = (item: Producto | any) => {
    const p =
      "idOferta" in item || "productoId" in item
        ? adaptarOfertaAProducto(item)
        : item;

    const existe = carrito.find((prod) => prod.id === p.id);
    if (existe) {
      incrementar(p.id);
    } else {
      guardar([...carrito, { ...p, quantity: 1 }]);
    }
  };

  const eliminarProducto = (id: number) => {
    guardar(carrito.filter((p) => p.id !== id));
  };

  const incrementar = (id: number) => {
    guardar(
      carrito.map((p) =>
        p.id === id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
      )
    );
  };

  const decrementar = (id: number) => {
    guardar(
      carrito.map((p) =>
        p.id === id && (p.quantity || 1) > 1
          ? { ...p, quantity: (p.quantity || 1) - 1 }
          : p
      )
    );
  };

  // ===============================
  // 🔹 Totales
  // ===============================

  const totalSinDescuento = carrito.reduce(
    (acc, p) => acc + (p.precioOriginal ?? p.precio) * (p.quantity ?? 1),
    0
  );

  const total = carrito.reduce(
    (acc, p) =>
      acc + (p.precioConDescuento ?? p.precioFinal ?? p.precio) * (p.quantity ?? 1),
    0
  );

  const totalDescuento = totalSinDescuento - total;

  const toggleCart = () => setIsOpen(!isOpen);

  // ===============================
  // 🔹 Proveedor
  // ===============================
  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        eliminarProducto,
        incrementar,
        decrementar,
        total,
        totalSinDescuento,
        totalDescuento,
        isOpen,
        toggleCart,
        limpiarCarrito,
        agregarAlCarrito: agregarProducto,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

// ===============================
// 🔹 Hook personalizado
// ===============================
export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context)
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return context;
};
