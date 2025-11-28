// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../types/usuario";
import axios from "axios";

/**
 * Tipo del contexto de autenticación que expone:
 * - user: usuario autenticado o null si no hay sesión
 * - loading: estado de carga mientras se verifica la sesión
 * - login: función para iniciar sesión (devuelve el usuario)
 * - logout: función para cerrar sesión
 * - refreshUser: fuerza la relectura del usuario desde el backend
 */
type AuthContextType = {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<Usuario>;
  logout: () => Promise<void>;
  refreshUser: (showLoading?: boolean) => Promise<void>;
};

/**
 * Contexto de autenticación. Inicialmente undefined para permitir
 * detectar uso fuera del proveedor mediante useAuth().
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor de autenticación que mantiene el estado del usuario y
 * ofrece funciones para login/logout y refresco del usuario.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado local que contiene el usuario autenticado o null.
  const [user, setUser] = useState<Usuario | null>(null);

  // Flag que indica si se está comprobando/cargando el estado de autenticación.
  const [loading, setLoading] = useState(true);

  // URL base de la API tomada de las variables de entorno Vite.
  const API_BASE = import.meta.env.VITE_API_URL;

  /**
   * refreshUser: solicita al backend el perfil del usuario actualmente autenticado.
   * - showLoading: si es true se activa el indicador loading (por ejemplo, para bloqueos UI).
   * - Maneja respuestas donde el backend puede devolver { usuario: {...} } o directamente {...}.
   * - En caso de error se limpia el usuario (sesión inválida/expirada).
   */
  const refreshUser = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);

      const { data } = await axios.get(`${API_BASE}/usuarios/perfil`, {
        withCredentials: true,
      });

      // Compatibilidad con distintos formatos de respuesta del backend.
      setUser(data.usuario ?? data);
    } catch (err) {
      // Si falla la petición, asumimos que no hay usuario autenticado.
      setUser(null);
    } finally {
      // Siempre desactivamos el estado de carga al terminar.
      setLoading(false);
    }
  };

  /**
   * Efecto de montaje: intenta cargar la sesión existente sin bloquear la UI
   * (refresh inicial). Ejecutado una sola vez al montar el proveedor.
   */
  useEffect(() => {
    refreshUser(); // primera carga sin bloquear la UI
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * login: realiza la petición de login al backend con credenciales.
   * - Al resolverse guarda el usuario en el estado local y lo devuelve.
   * - Propaga errores como excepciones para que el llamador los maneje.
   */
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
      // Logueo para diagnóstico; lanzamos un error genérico al cliente.
      console.error("Error en login:", err);
      throw new Error("Error al iniciar sesión");
    }
  };

  /**
   * logout: solicita al backend el cierre de sesión y limpia el estado local.
   * - Lanza error si la petición falla para que el llamador lo gestione.
   */
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
      //throw new Error("Error al cerrar sesión");
    }finally{
      setUser(null);
    }
  };

  // Proveemos el contexto con estado y funciones disponibles para la app.
  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth: hook personalizado para consumir el contexto de autenticación.
 * - Lanza un error si se usa fuera de AuthProvider para evitar comportamientos inesperados.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
