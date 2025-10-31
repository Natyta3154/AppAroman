// hooks/useUsuarios.ts
import { useState, useEffect } from "react";
import type { Usuario } from "../types/usuario";

const API_BASE = import.meta.env.VITE_API_URL;

// Función para manejar refresh token automáticamente
async function requestWithRefresh(url: string, options: RequestInit = {}) {
  const res = await fetch(url, { ...options, credentials: "include" });

  if (res.status === 401) {
    // Intentar renovar token
    const refreshRes = await fetch(`${API_BASE}/api/usuarios/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!refreshRes.ok) throw new Error("Sesión expirada, por favor loguearse de nuevo");

    // Reintentar la request original
    return fetch(url, { ...options, credentials: "include" });
  }

  return res;
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // Cargar todos los usuarios
  // =========================
  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await requestWithRefresh(`${API_BASE}/usuarios/listaDeUser`);
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data: Usuario[] = await res.json();
      setUsuarios(data);
    } catch (err: any) {
      console.error(err);
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Crear usuario
  // =========================
  const createUsuario = async (usuario: Omit<Usuario, "id">) => {
    const res = await requestWithRefresh(`${API_BASE}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    if (!res.ok) throw new Error("Error al crear usuario");
    const nuevo: Usuario = await res.json();
    setUsuarios(prev => [...prev, nuevo]);
    return nuevo;
  };

  // =========================
  // Actualizar usuario
  // =========================
  const updateUsuario = async (id: number, usuario: Partial<Usuario>) => {
    const res = await requestWithRefresh(`${API_BASE}/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    if (!res.ok) throw new Error("Error al actualizar usuario");
    const updated: Usuario = await res.json();
    setUsuarios(prev => prev.map(u => (u.id === id ? updated : u)));
    return updated;
  };

  // =========================
  // Eliminar usuario
  // =========================
  const deleteUsuario = async (id: number) => {
    const res = await requestWithRefresh(`${API_BASE}/usuarios/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar usuario");
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return { usuarios, loading, error, fetchUsuarios, createUsuario, updateUsuario, deleteUsuario };
}
