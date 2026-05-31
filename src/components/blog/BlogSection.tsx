import { motion } from "framer-motion";
import { usePosts } from "../../hooks/usePosts";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const { posts, cargando } = usePosts();
  const featured = posts.slice(0, 3);

  //Skeleton loader elegante para el blog
if (cargando)
  return (
    <main className="bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-20 px-4">
      <section className="max-w-7xl mx-auto px-5 sm:px-10 md:px-16 py-16">
        <div className="text-center mb-12">
          <div className="h-10 w-56 bg-white/40 rounded-xl mx-auto animate-pulse"></div>
          <div className="h-4 w-80 bg-white/30 rounded-xl mx-auto mt-4 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden animate-pulse"
            >
              <div className="w-full h-64 bg-white/30" />
              <div className="p-6 space-y-4">
                <div className="h-6 w-3/4 bg-white/50 rounded"></div>
                <div className="h-4 w-full bg-white/40 rounded"></div>
                <div className="h-4 w-5/6 bg-white/40 rounded"></div>
                <div className="h-10 w-32 bg-white/60 rounded-full mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );


  return (
    <main className="bg-gradient-to-b from-brand-dark to-gray-900 py-20 px-4 relative">
      <section className="max-w-7xl mx-auto px-5 sm:px-10 md:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-md">
            Inspiración Aromanza
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
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
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transform hover:-translate-y-2 transition-all duration-500 group relative flex flex-col"
            >
              <img
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                src={post.imagenUrl}
                alt={post.titulo}
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                  {post.titulo}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6 flex-grow">
                  {post.descripcion}
                </p>
                <div className="mt-auto">
                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold px-6 py-2 rounded-full hover:bg-white/30 transition-all shadow-lg"
                    >
                      Leer más
                    </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default BlogSection;
