import type { Usuario } from "../types/usuario";

const API_BASE = import.meta.env.VITE_API_URL;

export const usuarioService = {
  // Login -> backend devuelve { usuario: {...} } según tu controlador
  async login(email: string, password: string): Promise<{ usuario: Usuario } | any> {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Credenciales inválidas");
    }

    return res.json(); // puede ser { usuario: Usuario, ... }
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  // Perfil -> tu backend /usuarios/perfil devuelve { usuario: {...} }
  async getCurrentUser(): Promise<{ usuario: Usuario } | Usuario> {
    const res = await fetch(`${API_BASE}/usuarios/perfil`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("No autenticado");
    return res.json();
  },

  // CRUD / admin
  async getAll(): Promise<Usuario[]> {
    const res = await fetch(`${API_BASE}/usuarios/listaDeUser`, { credentials: "include" });
    if (!res.ok) throw new Error("Error al obtener usuarios");
    return res.json();
  },

  async create(usuario: Omit<Usuario, "id">): Promise<Usuario> {
    const res = await fetch(`${API_BASE}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al crear usuario");
    return res.json();
  },

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    const res = await fetch(`${API_BASE}/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al actualizar usuario");
    return res.json();
  },

  async remove(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/usuarios/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al eliminar usuario");
  },
};
