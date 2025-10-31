import { motion } from "framer-motion";
import { usePosts } from "../../hooks/usePosts";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const { posts, cargando } = usePosts();
  const featured = posts.slice(0, 3);

  if (cargando) return <p className="text-center mt-10">Cargando posts...</p>;

  return (
    <main className=" bg-gradient-to-b from-gray-100 bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] to-gray-200 py-20 px-4">
      <section className="max-w-7xl mx-auto px-5 sm:px-10 md:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Inspiración Aromanza
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Bienestar, energía y armonía. Descubrí notas, rituales y consejos para conectar con la esencia de tu alma.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {featured.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 group relative"
            >
              <img
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                src={post.imagenUrl}
                alt={post.titulo}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                  {post.titulo}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {post.descripcion}
                </p>
                <Link
                  to={`/blog/${post.id}`}
                  className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition"
                >
                  Leer más
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default BlogSection;
