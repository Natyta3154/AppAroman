import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/usuarios"; // cambiar en prod

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
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    if (!res.ok) {
      // capturo el mensaje del backend si existe
      const errorData = await res.json();
      throw new Error(errorData.error || "Error en el registro");
    }

    // si todo bien
    alert("✅ Usuario registrado con éxito. Ahora inicia sesión.");
    navigate("/login"); // 🔹 redirige al login
  } catch (err: any) {
    setError(err.message || "Error al registrarse");
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
            onChange={e => setNombre(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-700 text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded bg-gray-700 text-white"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
