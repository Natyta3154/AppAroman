import { useLocation } from "react-router-dom";
import { usePedido } from "../hooks/usePedidoCliente";

export default function FalloPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pedidoId = params.get("pedido_id");

  const { pedido, loading, error } = usePedido(pedidoId);

  if (loading) return <p>Cargando estado del pedido...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Pago rechazado ❌</h1>
      <p>Pedido ID: {pedidoId}</p>
      <p>Estado del pago: {pedido?.estadoPago || "No disponible"}</p>
      <p>Si ya pagaste, contacta soporte.</p>
    </div>
  );
}
