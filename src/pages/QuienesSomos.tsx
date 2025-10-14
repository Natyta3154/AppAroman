// QuienesSomos.tsx

import { motion } from "framer-motion";

export default function QuienesSomos() {
  return (
            <main className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-200 py-20 bg-yellow-20 bg-cover bg-center bg-no-repeat bg-fixed bg-blend-overlay">

    <section className="bg-gray-50 py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Imagen / Ilustración */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="Nuestro equipo"
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </motion.div>

        {/* Contenido */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-slate-800"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Quiénes Somos
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6 text-[15px]">
            Somos un equipo apasionado por la innovación, la tecnología y la
            excelencia en cada detalle. Nuestro objetivo es ofrecer soluciones
            digitales que conecten personas, impulsen negocios y generen impacto
            real.
          </p>

          <p className="text-slate-600 leading-relaxed mb-6 text-[15px]">
            Desde nuestros comienzos, hemos trabajado para construir una empresa
            sólida, basada en valores como la transparencia, el compromiso y la
            mejora continua. Creemos que el éxito se alcanza cuando cada cliente
            se siente acompañado y comprendido.
          </p>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">
              Nuestra Misión
            </h3>
            <p className="text-slate-600 text-[15px] leading-relaxed">
              Brindar experiencias digitales únicas, ayudando a nuestros clientes
              a transformar sus ideas en proyectos exitosos con tecnología,
              creatividad y confianza.
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">
              Nuestra Visión
            </h3>
            <p className="text-slate-600 text-[15px] leading-relaxed">
              Ser un referente en soluciones digitales innovadoras y sostenibles,
              comprometidos con la calidad, la ética y el crecimiento conjunto.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
            </main>
  );
}
