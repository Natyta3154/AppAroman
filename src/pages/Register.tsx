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
  const [showPassword, setShowPassword] = useState(false); // Estado para el ojito

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // limpiar errores previos

    try {
      await axios.post(
        `${API_BASE}/usuarios/register`,
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
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Registro
        </h2>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          {/* CAMPO DE CONTRASEÑA CON EL "OJITO" */}
          <div className="relative">
            <input
              // 1. Tipo dinámico basado en el estado
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              // 2. Añadir pr-10 para dejar espacio al icono
              className="w-full p-3 pr-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* 3. Botón/Icono para mostrar/ocultar */}
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition duration-150"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? (
                <span className="text-xl">🙈</span> // Ícono ocultar
              ) : (
                <span className="text-xl">👁️</span> // Ícono mostrar
              )}
            </button>
          </div>
          {/* FIN CAMPO DE CONTRASEÑA */}
          
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-4 text-gray-300 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}