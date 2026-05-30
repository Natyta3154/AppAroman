// src/hooks/usePerfil.ts
import { useEffect, useState } from "react";
import api from "../utils/api";
import type { Usuario } from "../types/usuario";

export function usePerfil() {
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const { data } = await api.put(`//usuarios/perfil`, {
          withCredentials: true,
        });

        setPerfil(data.usuario ?? data);
      } catch (err: any) {
        setError("No hay sesión activa");
        setPerfil(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  return { perfil, loading, error };
}
