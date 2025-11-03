// ------------------------------
// src/context/AuthContext.tsx
// ------------------------------
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../types/usuario";
import axios from "axios";

// 🔹 Tipo del contexto de autenticación
type AuthContextType = {
  user: Usuario | null;           // Usuario logueado (null si no hay sesión)
  loading: boolean;               // True mientras verificamos sesión activa
  login: (email: string, password: string) => Promise<Usuario>; // Función para login
  logout: () => Promise<void>;    // Función para logout
  refreshUser: () => Promise<void>; // Verifica sesión activa al iniciar
};

// 🔹 Creamos el contexto vacío
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL;

  // 🔹 Refrescar usuario al iniciar la app
  const refreshUser = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/usuarios/perfil`, {
        withCredentials: true,
      });
      setUser(data.usuario ?? data);
    } catch (err) {
      console.warn("No hay sesión activa:", err);
      setUser(null);
    } finally {
      setLoading(false); // 👈 importante, siempre paramos loading
    }
  };

  // 🔹 Efecto que se ejecuta solo una vez al montar
  useEffect(() => {
    refreshUser();
  }, []);

  // 🔹 Función de login
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

  // 🔹 Función de logout
  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/usuarios/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      throw new Error("Error al cerrar sesión");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 Hook para consumir el contexto de manera segura
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}