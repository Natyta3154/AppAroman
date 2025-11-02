// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../types/usuario";
import axios from "axios";

// 🔹 Definimos la forma del contexto de autenticación
type AuthContextType = {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Usuario>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

// 🔹 Creamos el contexto vacío
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL;

  // 🧠 Importante: definimos refreshUser *antes* de usarlo en useEffect
  const refreshUser = async () => {
    try {
      // Verifica sesión actual (requiere que el backend responda con cookie o JWT)
      const { data } = await axios.get(`${API_BASE}/usuarios/perfil`, {
        withCredentials: true,
      });
      setUser(data.usuario ?? data);
    } catch (err) {
      console.warn("No hay sesión activa:", err);
      setUser(null);
    } finally {
      // 👇 Esto asegura que el loading se detenga incluso si el backend falla
      setLoading(false);
    }
  };

  // 🔹 Efecto que se ejecuta al montar la app (solo una vez)
  useEffect(() => {
    refreshUser();
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
      console.error("Error en login:", err);
      throw new Error("Error al iniciar sesión");
    }
  };

  // 🔹 LOGOUT
  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/usuarios/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      throw new Error("Error al cerrar sesión");
    }
  };

  // ✅ El valor del contexto: siempre incluye user, loading y funciones de control
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 Hook para consumir el contexto de forma segura
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
