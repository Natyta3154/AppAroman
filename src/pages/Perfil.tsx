// src/pages/Perfil.tsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export default function Perfil() {
  const { user, loading, logout, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    password: "",
  });

  const [estado, setEstado] = useState<"idle" | "guardando" | "exito" | "error">(
    "idle"
  );

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  if (!user)
    return (
      <p className="text-center mt-10 text-red-500">
        No hay sesión activa. Inicia sesión para ver tu perfil.
      </p>
    );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setEstado("guardando");

      await axios.put(
        `${import.meta.env.VITE_API_BASE}/perfil`,
        formData,
        { withCredentials: true }
      );

      // Recargar datos del usuario desde el backend
      await refreshUser();

      setEstado("exito");
    } catch (error) {
      console.error(error);
      setEstado("error");
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-500 overflow-hidden">
      <div className="max-w-md w-full mx-auto mt-10 p-6 shadow-lg rounded-xl bg-white">
        <h1 className="text-2xl font-bold text-center mb-4">Editar Perfil</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-semibold">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="font-semibold">Nueva contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Dejar vacío si no se cambia"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <button
            disabled={estado === "guardando"}
            className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {estado === "guardando" ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        {estado === "exito" && (
          <p className="text-green-600 text-center mt-3">
            Perfil actualizado correctamente 🎉
          </p>
        )}

        {estado === "error" && (
          <p className="text-red-500 text-center mt-3">
            Ocurrió un error al actualizar
          </p>
        )}

        <button
          className="mt-6 w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
