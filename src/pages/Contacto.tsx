import React, { useState } from "react";
import axios from "axios";

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [estado, setEstado] = useState<"idle" | "enviando" | "exito" | "error">(
    "idle"
  );

  const API_BASE = import.meta.env.VITE_API_URL;

  // Manejar cambios en los campos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envío del formulario (aquí podrías integrar tu endpoint de correo)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");

    try {
      // Ejemplo de envío al backend (ajustá el endpoint)
      await axios.post(`${API_BASE}/api/contacto/enviar`, formData);

      setEstado("exito");
      setFormData({ nombre: "", email: "", mensaje: "" });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      setEstado("error");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 from-[#E9D8FD] via-[#775c92] to-[#a06b9a] to-gray-200 py-50 px-4 to-gray-200 bg-fixed bg-cover bg-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* FORMULARIO DE CONTACTO */}
          <div className="bg-white rounded-4xl shadow-sm border border-gray-200 p-8 ">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Contáctanos
            </h2>
            <p className="text-slate-600 text-[15px] mb-8">
              ¿Tenés alguna consulta o propuesta? Completá el formulario y te
              responderemos a la brevedad.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="text-slate-900 text-sm font-medium mb-2 block"
                >
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-sm text-slate-900 focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-slate-900 text-sm font-medium mb-2 block"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Ej: juan@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-sm text-slate-900 focus:border-indigo-600 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="mensaje"
                  className="text-slate-900 text-sm font-medium mb-2 block"
                >
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  placeholder="Escribí tu mensaje..."
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-sm text-slate-900 focus:border-indigo-600 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={estado === "enviando"}
                className={`w-full bg-purple-600 text-sm font-medium py-3 px-6 rounded-lg transition-colors border-0 cursor-pointer
                  ${
                    estado === "enviando"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-700 hover:bg-purple-900 text-white"
                  }`}
              >
                {estado === "enviando"
                  ? "Enviando..."
                  : estado === "exito"
                  ? "Mensaje enviado ✅"
                  : estado === "error"
                  ? "Error al enviar ❌"
                  : "Enviar mensaje"}
              </button>
            </form>
          </div>

          {/* INFORMACIÓN DE CONTACTO */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-8">
                Información de contacto
              </h3>

              <div className="space-y-6 text-slate-600 text-sm">
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-indigo-700"
                    viewBox="0 0 64 64"
                    fill="currentColor"
                  >
                    <path d="M32 0A24 24 0 0 0 8 24c0 17.23 22.36 38.81 23.31 39.72a1 1 0 0 0 1.38 0C33.64 62.81 56 41.23 56 24A24 24 0 0 0 32 0zm0 35a11 11 0 1 1 11-11 11.007 11.007 0 0 1-11 11z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-indigo-700 mb-1">
                      Nuestra ubicación
                    </h4>
                    <p>Av. Principal 123, Buenos Aires, Argentina</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-indigo-700"
                    viewBox="0 0 513.64 513.64"
                    fill="currentColor"
                  >
                    <path d="m499.66 376.96-71.68-71.68c-25.6-25.6-69.12-15.359-79.36 17.92-7.68 23.041-33.28 35.841-56.32 30.72-51.2-12.8-120.32-79.36-133.12-133.12-7.68-23.041 7.68-48.641 30.72-56.32 33.28-10.24 43.52-53.76 17.92-79.36l-71.68-71.68c-20.48-17.92-51.2-17.92-69.12 0L18.38 62.08c-48.64 51.2 5.12 186.88 125.44 307.2s256 176.641 307.2 125.44l48.64-48.64c17.921-20.48 17.921-51.2 0-69.12z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-indigo-700 mb-1">
                      Teléfono
                    </h4>
                    <p>+54 11 5555-1234</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-indigo-700"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M298.789 313.693c-12.738 8.492-27.534 12.981-42.789 12.981-15.254 0-30.05-4.489-42.788-12.981L3.409 173.82A76.269 76.269 0 0 1 0 171.403V400.6c0 26.278 21.325 47.133 47.133 47.133h417.733c26.278 0 47.133-21.325 47.133-47.133V171.402a75.21 75.21 0 0 1-3.416 2.422z" />
                    <path d="m20.05 148.858 209.803 139.874c7.942 5.295 17.044 7.942 26.146 7.942 9.103 0 18.206-2.648 26.148-7.942L491.95 148.858c12.555-8.365 20.05-22.365 20.05-37.475 0-25.981-21.137-47.117-47.117-47.117H47.117C21.137 64.267 0 85.403 0 111.408a44.912 44.912 0 0 0 20.05 37.45z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-indigo-700 mb-1">
                      Correo electrónico
                    </h4>
                    <p>contacto@tuempresa.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">
                Horarios de atención
              </h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex justify-between">
                  <span>Lunes a Viernes</span>
                  <span>09:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Sábado</span>
                  <span>10:00 - 14:00</span>
                </li>
                <li className="flex justify-between">
                  <span>Domingo</span>
                  <span className="text-slate-500">Cerrado</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
