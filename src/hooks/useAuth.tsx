import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../types/usuario";

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
    const res = await fetch(`${API_BASE}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // para cookies JWT si usas
    });

    if (!res.ok) throw new Error("Error en login");

    const data = await res.json();
    const usuario = data.usuario ?? data;
    setUser(usuario);
    return usuario;
  };

  // 🔹 LOGOUT
  const logout = async () => {
    await fetch(`${API_BASE}/usuarios/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  // 🔹 REFRESH USER
const refreshUser = async () => {
  try {
    const res = await fetch(`${API_BASE}/usuarios/perfil`, {
      credentials: "include",
    });
    if (!res.ok) {
      // Usuario no autenticado, simplemente limpiamos el estado
      setUser(null);
      return;
    }
    const data = await res.json();
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
