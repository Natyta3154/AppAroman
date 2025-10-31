// ✅ src/utils/precio.ts
import type { Producto, Oferta } from "../types/producto";


export function calcularPrecioConDescuento(producto: Producto): number {
  if (!producto.ofertas || producto.ofertas.length === 0) return producto.precio;

  // Busca la primera oferta activa
  const ofertaActiva: Oferta | undefined = producto.ofertas.find(o => o.estado);
  if (!ofertaActiva) return producto.precio;

  if (ofertaActiva.tipoDescuento === "MONTO") {
    return producto.precio - (ofertaActiva.valorDescuento ?? 0);
  } else if (ofertaActiva.tipoDescuento === "PORCENTAJE") {
    const descuento = (ofertaActiva.valorDescuento ?? 0) / 100;
    return producto.precio - producto.precio * descuento;
  }

  return producto.precio;
}
