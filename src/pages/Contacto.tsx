import React, { useState } from "react";

export default function ContactSection() {
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Manejar cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar envío de formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    alert("Mensaje enviado correctamente 🚀");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
            <main className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-200 py-20 bg-yellow-20 bg-cover bg-center bg-no-repeat bg-fixed bg-blend-overlay">

    <div className="max-w-7xl max-lg:max-w-3xl mx-auto p-4 md:p-8">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* FORMULARIO */}
        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Get in touch
          </h2>
          <p className="text-slate-600 text-[15px] mb-8 leading-relaxed">
            Feel free to contact us and we will get back to you as soon as
            possible
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-slate-900 text-sm font-medium mb-2 block">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-sm text-slate-900 focus:border-indigo-500 outline-0"
              />
            </div>

            <div>
              <label className="text-slate-900 text-sm font-medium mb-2 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-sm text-slate-900 focus:border-indigo-500 outline-0"
              />
            </div>

            <div>
              <label className="text-slate-900 text-sm font-medium mb-2 block">
                Message
              </label>
              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-sm text-slate-900 focus:border-indigo-500 outline-0"
              />
            </div>

            <button
              type="submit"
              className="w-full text-sm bg-indigo-700 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-lg transition-colors border-0 cursor-pointer"
            >
              Send message
            </button>
          </form>
        </div>

        {/* INFORMACIÓN DE CONTACTO */}
        <div className="space-y-8">
          {/* Contact Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-8">
              Contact Information
            </h3>

            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-start space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 fill-indigo-700"
                  viewBox="0 0 64 64"
                >
                  <path d="M32 0A24.032 24.032 0 0 0 8 24c0 17.23 22.36 38.81 23.31 39.72a.99.99 0 0 0 1.38 0C33.64 62.81 56 41.23 56 24A24.032 24.032 0 0 0 32 0zm0 35a11 11 0 1 1 11-11 11.007 11.007 0 0 1-11 11z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-indigo-700 text-sm mb-2">
                    Our Location
                  </h4>
                  <p className="text-slate-600 text-sm">123 Business Street</p>
                  <p className="text-slate-600 text-[13px] mt-0.5">
                    New York, NY 10001
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 fill-indigo-700"
                  viewBox="0 0 513.64 513.64"
                >
                  <path d="m499.66 376.96-71.68-71.68c-25.6-25.6-69.12-15.359-79.36 17.92-7.68 23.041-33.28 35.841-56.32 30.72-51.2-12.8-120.32-79.36-133.12-133.12-7.68-23.041 7.68-48.641 30.72-56.32 33.28-10.24 43.52-53.76 17.92-79.36l-71.68-71.68c-20.48-17.92-51.2-17.92-69.12 0L18.38 62.08c-48.64 51.2 5.12 186.88 125.44 307.2s256 176.641 307.2 125.44l48.64-48.64c17.921-20.48 17.921-51.2 0-69.12z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-indigo-700 text-sm mb-2">
                    Phone Number
                  </h4>
                  <p className="text-slate-600 text-[13px]">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 fill-indigo-700"
                  viewBox="0 0 512 512"
                >
                  <path d="M298.789 313.693c-12.738 8.492-27.534 12.981-42.789 12.981-15.254 0-30.05-4.489-42.788-12.981L3.409 173.82A76.269 76.269 0 0 1 0 171.403V400.6c0 26.278 21.325 47.133 47.133 47.133h417.733c26.278 0 47.133-21.325 47.133-47.133V171.402a75.21 75.21 0 0 1-3.416 2.422z" />
                  <path d="m20.05 148.858 209.803 139.874c7.942 5.295 17.044 7.942 26.146 7.942 9.103 0 18.206-2.648 26.148-7.942L491.95 148.858c12.555-8.365 20.05-22.365 20.05-37.475 0-25.981-21.137-47.117-47.117-47.117H47.117C21.137 64.267 0 85.403 0 111.408a44.912 44.912 0 0 0 20.05 37.45z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-indigo-700 text-sm mb-2">
                    Email Address
                  </h4>
                  <p className="text-slate-600 text-[13px]">
                    contact@business.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-8">
              Hours of Operation
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between gap-4 flex-wrap">
                <span className="text-slate-600 text-sm">Monday - Friday</span>
                <span className="text-slate-900 text-sm">
                  9:00 AM - 6:00 PM
                </span>
              </div>
              <div className="flex justify-between gap-4 flex-wrap">
                <span className="text-slate-600 text-sm">Saturday</span>
                <span className="text-slate-900 text-sm">
                  10:00 AM - 4:00 PM
                </span>
              </div>
              <div className="flex justify-between gap-4 flex-wrap">
                <span className="text-slate-600 text-sm">Sunday</span>
                <span className="text-slate-900 text-sm">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
            </main>
  );
}
