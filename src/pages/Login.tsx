// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 🔹 Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);

      // Redirección según rol
      if (data.rol === "ADMIN") navigate("/admin");
      else navigate("/");

      toast.success("¡Bienvenido!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error en la conexión con el servidor");
      toast.error("Error al iniciar sesión ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🔹 Fondo con gradiente y overlay de imagen
    <main className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-500 overflow-hidden">
      {/* 🔹 Imagen de fondo decorativa */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://media.istockphoto.com/id/1460937551/photo/smoldering-white-sage-smudge-stick.jpg?s=2048x2048&w=is&k=20&c=VwgEO_n0h-m48eNCSxiyX4OyXbD1_0Z77RkYTQzOptw="
         //src="https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg"
          alt="Fondo decorativo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 🔹 Contenedor del formulario: efecto glassmorphism */}
      <div className="relative z-10 max-w-md w-full space-y-8 bg-gray-900/70 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 animate-fadeIn">
        {/* 🔹 Logo y título */}
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Logo"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Inicia sesión
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            O{" "}
            <a
              href="/register"
              className="font-medium text-indigo-400 hover:text-indigo-300"
            >
              crea una cuenta nueva
            </a>
          </p>
        </div>

        {/* 🔹 Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error de login */}
          {error && (
            <p className="text-red-500 text-center font-medium">{error}</p>
          )}

          {/* 🔹 Inputs */}
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
                className="appearance-none rounded-lg relative block w-full px-4 py-3 text-gray-100 placeholder-gray-400 bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 hover:scale-105"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="appearance-none rounded-lg relative block w-full px-4 py-3 text-gray-100 placeholder-gray-400 bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 hover:scale-105"
              />
              {/* 🔹 Botón para mostrar/ocultar password */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
              </button>
            </div>
          </div>

          {/* 🔹 Recordarme y olvidé mi contraseña */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-gray-300 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-600 rounded mr-2"
              />
              Recordarme
            </label>
            <a
              href="#"
              className="font-medium text-indigo-400 hover:text-indigo-300 text-sm"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* 🔹 Botón de login */}
          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/50 hover:shadow-indigo-600/60"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200`}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </div>

      {/* 🔹 Animación fadeIn usando Tailwind custom */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}
      </style>
    </main>
  );
}
