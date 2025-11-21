// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../types/usuario";
import axios from "axios";

type AuthContextType = {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Usuario>;
  logout: () => Promise<void>;
  refreshUser: (showLoading?: boolean) => Promise<void>; 
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL;

  // 🔹 Refrescar usuario
  const refreshUser = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);

      const { data } = await axios.get(`${API_BASE}/usuarios/perfil`, {
        withCredentials: true,
      });

      // Backend puede responder {usuario:{...}} o {...} directo
      setUser(data.usuario ?? data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cargar sesión al iniciar
  useEffect(() => {
    refreshUser(); // primera carga sin bloquear
  }, []);

  // 🔹 Login
  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/usuarios/login`,
        { email, password },
        { withCredentials: true }
      );

      const usuario = data.usuario ?? data;
      setUser(usuario);

      return usuario;
    } catch (err) {
      console.error("Error en login:", err);
      throw new Error("Error al iniciar sesión");
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE}/usuarios/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      throw new Error("Error al cerrar sesión");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
