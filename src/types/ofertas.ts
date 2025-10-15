// src/types/oferta.ts
export interface Oferta {
  idOferta?: number;
  valorDescuento?: number; // porcentaje o monto
  tipoDescuento?: "PORCENTAJE" | "MONTO" | string;
  fechaInicio?: string | null; // ISO date string
  fechaFin?: string | null;
  estado?: boolean;
}
