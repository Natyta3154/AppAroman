
const posts = [
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

const BlogSection = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
      {/* Header */}
      <div className="border-b mb-5 flex justify-between text-sm">
        <div className="text-indigo-600 flex items-center pb-2 pr-2 border-b-2 border-indigo-600 uppercase">
          <svg
            className="h-6 mr-3"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 455.005 455.005"
          >
            <path d="M446.158,267.615c-5.622-3.103-12.756-2.421-19.574,1.871l-125.947,79.309c-3.505,2.208-4.557,6.838-2.35,10.343 c2.208,3.505,6.838,4.557,10.343,2.35l125.947-79.309c2.66-1.675,4.116-1.552,4.331-1.432c0.218,0.12,1.096,1.285,1.096,4.428 c0,8.449-6.271,19.809-13.42,24.311l-122.099,76.885c-6.492,4.088-12.427,5.212-16.284,3.084c-3.856-2.129-6.067-7.75-6.067-15.423 c0-19.438,13.896-44.61,30.345-54.967l139.023-87.542c2.181-1.373,3.503-3.77,3.503-6.347s-1.323-4.974-3.503-6.347L184.368,50.615 c-2.442-1.538-5.551-1.538-7.993,0L35.66,139.223C15.664,151.815,0,180.188,0,203.818v4c0,23.63,15.664,52.004,35.66,64.595 l209.292,131.791c3.505,2.207,8.136,1.154,10.343-2.35c2.207-3.505,1.155-8.136-2.35-10.343L43.653,259.72 C28.121,249.941,15,226.172,15,207.818v-4c0-18.354,13.121-42.122,28.653-51.902l136.718-86.091l253.059,159.35l-128.944,81.196 c-20.945,13.189-37.352,42.909-37.352,67.661c0,13.495,4.907,23.636,13.818,28.555c3.579,1.976,7.526,2.956,11.709,2.956 c6.231,0,12.985-2.176,19.817-6.479l122.099-76.885c11.455-7.213,20.427-23.467,20.427-37.004 C455.004,277.119,451.78,270.719,446.158,267.615z" />
          </svg>
          <a href="#" className="font-semibold inline-block">
            Cooking Blog
          </a>
        </div>
        <a href="#">See All</a>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {posts.map((post) => (
          <div key={post.id} className="rounded overflow-hidden shadow-lg flex flex-col">
            <div className="relative">
              <a href="#">
                <img className="w-full" src={post.image} alt={post.title} />
                <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25"></div>
              </a>
              <a href="#!">
                <div className="text-xs absolute top-0 right-0 bg-indigo-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-indigo-600 transition duration-500 ease-in-out">
                  {post.category}
                </div>
              </a>
            </div>
            <div className="px-6 py-4 mb-auto">
              <a
                href="#"
                className="font-medium text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2"
              >
                {post.title}
              </a>
              <p className="text-gray-500 text-sm">{post.description}</p>
            </div>
            <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
              <span className="py-1 text-xs text-gray-900 mr-1 flex flex-row items-center">
                <span className="ml-1">{post.time}</span>
              </span>
              <span className="py-1 text-xs text-gray-900 mr-1 flex flex-row items-center">
                <svg className="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="ml-1">{post.comments}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
