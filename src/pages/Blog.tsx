import { usePosts } from "../hooks/usePosts";
import BlogCard from "../conponents/blog/BlogCard";
import { motion } from "framer-motion";
import { useState } from "react";

const BlogPage = () => {
  const { posts, cargando } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (cargando) return <p className="text-center mt-10">Cargando posts...</p>;

  // Filtrado por categoría
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.categoria && post.categoria.nombre === selectedCategory)
    : posts;

  // Extraer categorías únicas
  const categories = Array.from(new Set(posts.map(post => post.categoria?.nombre).filter(Boolean)));

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-16 px-4">

      {/* Hero Blog */}
      <section className="bg-purple-100 mt-16 py-20 text-center rounded-4xl mb-12">
        <h1 className="text-5xl font-extrabold font-extrabold text-black mb-4">Blog Aromanza</h1>
        <p className="text-lg font-semibold text-black max-w-2xl mx-auto">
          Inspiración, bienestar y consejos aromáticos para elevar tu energía y armonizar tu día a día.
        </p>
      </section>

      {/* Filtro por categorías */}
      <div className="flex justify-center flex-wrap gap-3 mb-12">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full font-medium transition ${
            !selectedCategory ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-purple-200"
          }`}
        >
          Todas
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => cat && setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              selectedCategory === cat ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-purple-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts destacados */}
      {filteredPosts.length > 0 && (
        <section className="mb-12 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.slice(0, 2).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Listado completo de posts */}
      <section className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Todos los posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {filteredPosts.slice(2).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Suscripción al newsletter */}
      <section className="bg-purple-50 py-16 mt-16 rounded-3xl text-center">
        <h3 className="text-2xl font-semibold mb-4">No te pierdas nada</h3>
        <p className="text-gray-700 mb-6">
          Suscribite para recibir las últimas novedades y consejos aromáticos
        </p>
        <div className="flex justify-center flex-wrap gap-2">
          <input
            type="email"
            placeholder="Tu email"
            className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
          />
          <button className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
            Suscribirse
          </button>
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
