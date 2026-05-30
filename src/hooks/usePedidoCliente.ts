import { useState, useEffect } from "react";
import api from "../utils/api";


export function usePedido(pedidoId: string | null) {
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pedidoId) return;

    const fetchPedido = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`//pedidos/${pedidoId}/estado-pago`, {
          withCredentials: true,
        });
        setPedido(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [pedidoId]);

  return { pedido, loading, error };
}
