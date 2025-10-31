import { useCarrito } from "../contex/CarritoContext.tsx";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;



export function usePagoMercadoPago() {
  const { carrito } = useCarrito();
  const { user, loading } = useAuth(); // 🔹 este es el hook correcto
  const navigate = useNavigate();

  const handlePagar = async () => {
  if (loading) {
    // Todavía no sabemos si está logueado
    return;
  }

  if (!user) {
    navigate("/login");
    return;
  }

  // Aquí ya sabemos que está logueado
  console.log("Usuario logueado, se puede pagar");


    const res = await fetch(`${API_BASE}/pedidos/realizarPedidoConPago`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 👈 envía cookies automáticamente
      body: JSON.stringify({
        detalles: carrito.map(p => ({
          productoId: p.id,
          cantidad: p.quantity,
          precio: p.precio,
        })),
      }),
    });

    if (!res.ok) throw new Error("Error al generar preferencia de pago");

    const data = await res.json();
    console.log(data.init_point)
    // ✅ Redirigir directamente al link real del checkout de Mercado Pago
    window.location.href = data.init_point;
  };

  return { handlePagar };
}
