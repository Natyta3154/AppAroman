import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Usuario } from "../types/usuario";

interface AuthContextProps {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Usuario>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, login, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de <AuthProvider>");
  }
  return context;
}
