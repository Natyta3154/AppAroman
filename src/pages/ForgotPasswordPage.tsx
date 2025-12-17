// ------------------------------
// src/pages/ForgotPassword.tsx
// ------------------------------
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "../hooks/useForgotPassword"; // 💡 Importar el hook

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  
  // 💡 Usar el hook para obtener el estado y la función de la API
  const { message, error, loading, forgotPassword } = useForgotPassword(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resetear solo errores y mensajes previos antes de llamar al hook
    // El hook maneja su propio estado de loading, error y message.

    try {
      await forgotPassword(email);
      // Los mensajes de éxito/error ya están configurados en el hook
      if (error) {
          toast.error("Error al enviar email ❌");
      } else {
          toast.success("¡Email enviado! Revisa tu bandeja de entrada 📧");
          setEmail(""); // Limpiar el input después de un envío exitoso/simulado
      }
    } catch (err) {
        // Esto solo atraparía errores de código sincrónico, no de la promesa del fetch
        // El hook ya maneja la mayoría de los errores.
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-600 to-pink-500 overflow-hidden">
      
      {/* Imagen de fondo decorativa */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://media.istockphoto.com/id/1460937551/photo/smoldering-white-sage-smudge-stick.jpg?s=2048x2048&w=is&k=20&c=VwgEO_n0h-m48eNCSxiyX4OyXbD1_0Z77RkYTQzOptw="
          alt="Fondo decorativo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenedor del formulario estilo glassmorphism */}
      <div className="relative z-10 max-w-md w-full space-y-8 bg-gray-900/70 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 animate-fadeIn">
        
        {/* Título y descripción */}
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Logo"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Introduce tu email y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        {/* Mensaje de Éxito o Error (Usando el estado del hook) */}
        {message && (
          <p className="text-green-400 text-center font-medium border border-green-400 p-3 rounded-lg">{message}</p>
        )}
        {error && <p className="text-red-500 text-center font-medium">{error}</p>}

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Input Email */}
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
              className="appearance-none rounded-lg w-full px-4 py-3 text-gray-100 placeholder-gray-400 bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 hover:scale-105"
            />
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
              loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/50 hover:shadow-indigo-600/60"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200`}
          >
            {loading ? "Enviando enlace..." : "Enviar enlace de restablecimiento"}
          </button>
        </form>

        {/* Enlace para volver al login */}
        <div className="text-center">
          <a
            onClick={() => navigate("/login")}
            className="font-medium text-indigo-400 hover:text-indigo-300 text-sm cursor-pointer"
          >
            Volver a Iniciar Sesión
          </a>
        </div>
      </div>

      {/* Animación fadeIn personalizada */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        `}
      </style>
    </main>
  );
}