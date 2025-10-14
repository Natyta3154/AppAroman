// src/hooks/useProductos.ts
import { useState, useEffect, type ReactNode } from "react";

export interface Oferta {
  idOferta: number;
  valorDescuento: number;
  tipoDescuento: "PORCENTAJE" | "MONTO";
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;
  precio: number;
}

export interface Producto {
  quantity: number;
  precioConDescuento(precioConDescuento: any): import("react").ReactNode;
  precioOriginal: ReactNode;
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precioMayorista: number;
  totalIngresado: number;
  stock: number;
  imagenUrl: string;
  activo: boolean;
  categoriaNombre: string;
  mensaje: string | null;
  fragancias: string[];
  atributos: string[];
  ofertas: Oferta[];
  precioFinal: number; // nuevo campo calculado
  destacado?: boolean;  
}

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:8080/productos/listado");
        const data: Producto[] = await res.json();

        // Calculamos el precio final considerando ofertas activas
        const productosConOferta = data.map((p) => {
          let precioFinal = p.precio;

          // Filtramos ofertas activas y dentro de la fecha actual
          const hoy = new Date();
          const ofertaActiva = p.ofertas.find((o) => {
            const inicio = new Date(o.fechaInicio);
            const fin = new Date(o.fechaFin);
            return o.estado && hoy >= inicio && hoy <= fin;
          });

          if (ofertaActiva) {
            precioFinal = ofertaActiva.precio; // precio con descuento
          }

          return {
            ...p,
            precioFinal,
          };
        });

        setProductos(productosConOferta);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { productos, loading };
};
