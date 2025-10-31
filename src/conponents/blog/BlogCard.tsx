import type { Post } from "../../types/post";
import { Link } from "react-router-dom";

interface BlogCardProps {
  post: Post;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => (
  <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 group relative">
    <img 
      src={post.imagenUrl} 
      alt={post.titulo} 
      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
    />
    <div className="p-5">
      <div className="mb-2">
        {post.category && (
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {post.category.nombre}
          </span>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">{post.titulo}</h3>
      <p className="text-gray-600 mb-4">{post.descripcion}</p>
      <Link
        to={`/blog/${post.id}`}
        className="text-purple-600 font-medium hover:underline"
      >
        Leer más →
      </Link>
    </div>
  </div>
);

export default BlogCard;

