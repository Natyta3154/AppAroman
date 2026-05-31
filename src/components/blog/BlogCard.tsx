/* Este componente de React llamado BlogCard está diseñado para 
mostrar una tarjeta individual de una publicación de blog.  */ 


import type { Post } from "../../types/post";
import { Link } from "react-router-dom";

interface BlogCardProps {
  post: Post;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => (
  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 group relative flex flex-col h-full">
    <div className="relative overflow-hidden h-56">
      <img 
        src={post.imagenUrl} 
        alt={post.titulo} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      {post.categoria && (
        <span className="absolute top-3 left-3 bg-indigo-500/80 backdrop-blur-sm border border-indigo-400/50 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {post.categoria.nombre}
        </span>
      )}
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
        {post.titulo}
      </h3>
      <p className="text-white/70 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
        {post.descripcion}
      </p>
      <div className="mt-auto">
        <Link
          to={`/blog/${post.id}`}
          className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold px-6 py-2 rounded-full hover:bg-white/30 transition-all shadow-lg"
        >
          Leer más →
        </Link>
      </div>
    </div>
  </div>
);

export default BlogCard;

