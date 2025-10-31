import { Facebook, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-yellow-600   text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              alt="Logo"
              src="/rev.png"
              className="h-8 w-auto"
            />
            <span className="text-lg font-semibold text-white">
              Aromanza
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-6">
            <a href="/productos" className="hover:text-white transition">
              Productos
            </a>
            <a href="/ofertas" className="hover:text-white transition">
              Ofertas
            </a>
            <a href="/blog" className="hover:text-white transition">
              Blog
            </a>
            <a href="/contacto" className="hover:text-white transition">
              Contacto
            </a>
          </div>

          {/* Redes sociales */}
          <div className="flex space-x-4 mt-6">
            <a
              href="https://wa.me/123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-green-500 transition-colors"
            >
              <MessageCircle size={24} />
            </a>

            <a
              href="https://www.instagram.com/tuusuario"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-pink-500 transition-colors"
            >
              <Instagram size={24} />
            </a>

            <a
              href="https://www.facebook.com/tuusuario"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Facebook size={24} />
            </a>
          </div>
        </div>

        {/* Derechos reservados */}
        <div className="mt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Aromanza. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
