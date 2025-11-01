import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // limpiar errores previos

    try {
         await axios.post(
        `${API_BASE}/register`,
        { nombre, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ Registro exitoso
      alert("✅ Usuario registrado con éxito. Ahora inicia sesión.");
      navigate("/login");
    } catch (err: any) {
      // Captura mensaje de backend si existe
      if (err.response?.data?.error) setError(err.response.data.error);
      else setError(err.message || "Error al registrarse");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Registro</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-3 rounded bg-gray-700 text-white"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-3 rounded-lg"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-4 text-gray-300 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
