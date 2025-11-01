import { useCarrito } from "../contex/CarritoContext.tsx";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export function usePagoMercadoPago() {
  const { carrito } = useCarrito();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handlePagar = async () => {
    if (loading) return; // Todavía no sabemos si está logueado
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_BASE}/pedidos/realizarPedidoConPago`,
        {
          detalles: carrito.map(p => ({
            productoId: p.id,
            cantidad: p.quantity,
            precio: p.precio,
          })),
        },
        { withCredentials: true }
      );

      console.log(data.init_point);
      // Redirigir al checkout de Mercado Pago
      window.location.href = data.init_point;
    } catch (err) {
      console.error("Error al generar preferencia de pago:", err);
      throw new Error("Error al generar preferencia de pago");
    }
  };

  return { handlePagar };
}
