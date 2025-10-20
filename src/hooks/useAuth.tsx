// hooks/useAuth.ts
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Usuario } from "../types/usuario";
import { usuarioService } from "../services/usuarioService";
import type { ReactNode } from "react";

 
type AuthContextType = {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Usuario>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider envuelve la aplicación (o el layout) y provee uso de sesión desde cualquier componente
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Al montar: preguntar al backend por perfil (usa cookie)
  useEffect(() => {
    usuarioService
      .getCurrentUser()
      .then((data) => {
        // Maneja ambos formatos: { usuario: {...} } o directamente el usuario
        const u = (data as any)?.usuario ?? data;
        setUser(u ?? null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // login usa el servicio, normaliza la respuesta y guarda el usuario
  const login = async (email: string, password: string) => {
    const res = await usuarioService.login(email, password);
    // respuesta puede ser { usuario: {...} }
    const u = (res as any)?.usuario ?? res;
    setUser(u);
    return u as Usuario;
  };

  const logout = async () => {
    await usuarioService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// hook para consumir el contexto fácilmente
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
