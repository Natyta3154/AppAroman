


// src/types/producto.ts

import type { Oferta } from "./ofertas";

export interface OfertaSimple {
  idOferta?: number;
  valorDescuento?: number; // porcentaje o monto
  tipoDescuento?: "PORCENTAJE" | "MONTO" | string;
  fechaInicio?: string | null; // ISO date string
  fechaFin?: string | null;
  estado?: boolean;

}

export interface ProductoOferta {
  id: number;
  nombre: string;
  imagenUrl?: string;
  precioOriginal: number;
  precioConDescuento: number;
  fechaInicio?: string;
  fechaFin?: string;
}


// Resumen básico del producto para listados
export type ProductoResumen = {
  quantity: number;
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string;
  destacado?: boolean;
  precioFinal: number; 
  atributos: { nombre: string; valor: string }[];
};


export interface Producto {
  quantity: number;
  precioConDescuento(precioConDescuento: any): React.ReactNode;
  precioOriginal: React.ReactNode;
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precioMayorista: number;
  totalIngresado: number;
  stock: number;
  imagenUrl: string;
  activo: boolean;
   categoriaId: number;
  categoriaNombre: string;
  mensaje: string | null;
  fragancias: string[];
  atributos: { nombre: string; valor: string }[];
  ofertas: Oferta[];
  precioFinal: number; // ✅ campo calculado
  destacado?: boolean;
}

