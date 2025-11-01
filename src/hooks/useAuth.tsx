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
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL;

  // 🔹 Recupera usuario actual al iniciar la app
  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  // 🔹 LOGIN
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
      console.error(err);
      throw new Error("Error en login");
    }
  };

  // 🔹 LOGOUT
  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/usuarios/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error(err);
      throw new Error("Error al cerrar sesión");
    }
  };

  // 🔹 REFRESH USER
  const refreshUser = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/usuarios/perfil`, { withCredentials: true });
      setUser(data.usuario ?? data);
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 Hook para consumir el contexto
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
