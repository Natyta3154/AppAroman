


// src/types/producto.ts



export interface OfertaSimple {
  idOferta?: number;
  valorDescuento?: number; // porcentaje o monto
  tipoDescuento?: "PORCENTAJE" | "MONTO" | string;
  fechaInicio?: string | null; // ISO date string
  fechaFin?: string | null;
  estado?: boolean;

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
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;          // precio base
  precioMayorista: number;
  precioOriginal: number;  // igual a precio base, útil para mostrar tachado
  precioConDescuento: number; // calculado dinámicamente
  precioFinal: number;     // calculado dinámicamente
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
  destacado?: boolean;
}

export interface ProductoOferta {
  id: number;
  nombre: string;
  imagenUrl?: string;
  //precioOriginal: number;
   precio: number;  
   precioConDescuento: number;
  fechaInicio?: string;
  fechaFin?: string;
  estado: boolean;
}



//Ofertas 
export type TipoDescuento = "PORCENTAJE" | "MONTO";

/**
 * Representa una oferta activa o programada para un producto.
 */
export interface Oferta {
  idOferta: number;
  productoId: number;
  nombreProducto: string;
  descripcion?: string | null;
  precio: number;                 // precio original del producto
  valorDescuento: number;         // valor del descuento (porcentaje o monto fijo)
  tipoDescuento: TipoDescuento;   // tipo de descuento aplicado
  fechaInicio: string;
  fechaFin: string;
  estado: boolean;                // si la oferta está activa o no
  precioConDescuento: number;    // precio final calculado (si viene del backend)
  imagenUrl?: string;   
            // imagen del producto
}

