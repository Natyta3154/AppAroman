// Blog.tsx
import React from "react";

interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  time: string;
  comments: string;
}

const posts: Post[] = [
  {
    id: 1,
    title: "Simplest Salad Recipe ever",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    category: "Cooking",
    time: "6 mins ago",
    comments: "39 Comments",
  },
  {
    id: 2,
    title: "Best FastFood Ideas (Yummy)",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    category: "Cooking",
    time: "10 days ago",
    comments: "0 Comments",
  },
  {
    id: 3,
    title: "Why to eat salad?",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "https://images.pexels.com/photos/6086/food-salad-healthy-vegetables.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    category: "Cooking",
    time: "16 hours ago",
    comments: "9 Comments",
  },
];

const Blog: React.FC = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-6 sm:p-10 md:p-16">
      {/* Encabezado */}
      <div className="border-b mb-5 flex justify-between text-sm">
        <div className="text-indigo-600 flex items-center pb-2 pr-2 border-b-2 border-indigo-600 uppercase font-semibold">
          Cooking Blog
        </div>
        <a href="#" className="hover:text-indigo-600">
          See All
        </a>
      </div>

      {/* Grid de posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded overflow-hidden shadow-lg flex flex-col"
          >
            {/* Imagen */}
            <div className="relative">
              <img className="w-full" src={post.image} alt={post.title} />
              <div className="hover:bg-transparent transition duration-300 absolute inset-0 bg-gray-900 opacity-25"></div>
              <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                {post.category}
              </div>
            </div>

            {/* Contenido */}
            <div className="px-6 py-4 mb-auto">
              <h2 className="font-medium text-lg hover:text-indigo-600 transition duration-500 ease-in-out mb-2">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm">{post.description}</p>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
              <span className="text-xs text-gray-700">{post.time}</span>
              <span className="text-xs text-gray-700">{post.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
