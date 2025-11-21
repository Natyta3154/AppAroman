// src/hooks/usePerfil.ts
import { useEffect, useState } from "react";
import axios from "axios";
import type { Usuario } from "../types/usuario";

export function usePerfil() {
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const { data } = await axios.put(`${API_BASE}/usuarios/perfil`, {
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
