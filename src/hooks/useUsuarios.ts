import { useState, useEffect } from "react";
import axios from "axios";
import type { AxiosRequestConfig } from "axios"; 
import type { Usuario } from "../types/usuario";

const API_BASE = import.meta.env.VITE_API_URL;

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar solicitudes con refresh token
  const requestWithRefresh = async (url: string, options: AxiosRequestConfig = {}) => {
    try {
      return await axios({ url: API_BASE + url, withCredentials: true, ...options });
    } catch (err: any) {
      if (err.response?.status === 401) {
        const refreshRes = await axios.post(`${API_BASE}/usuarios/refresh`, {}, { withCredentials: true });
        if (!refreshRes.status || refreshRes.status !== 200) {
          throw new Error("Sesión expirada, por favor loguearse de nuevo");
        }
        return axios({ url: API_BASE + url, withCredentials: true, ...options });
      }
      throw err;
    }
  };

  //Cargar usuarios
  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await requestWithRefresh("/usuarios/listaDeUser");
      setUsuarios(res.data);
    } catch (err: any) {
      console.error(err);
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  //Crear usuario
  const createUsuario = async (usuario: Omit<Usuario, "id">) => {
    const res = await requestWithRefresh("/usuarios", { method: "POST", data: usuario });
    setUsuarios(prev => [...prev, res.data]);
    return res.data;
  };

  //Actualizar usuario
  const updateUsuario = async (id: number, usuario: Partial<Usuario>) => {
    const res = await requestWithRefresh(`/usuarios/${id}`, { method: "PUT", data: usuario });
    setUsuarios(prev => prev.map(u => (u.id === id ? res.data : u)));
    return res.data;
  };

  //Eliminar usuario
  const deleteUsuario = async (id: number) => {
    await requestWithRefresh(`/usuarios/eliminarUser/${id}`, { method: "DELETE" });
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return { usuarios, loading, error, fetchUsuarios, createUsuario, updateUsuario, deleteUsuario };
}
