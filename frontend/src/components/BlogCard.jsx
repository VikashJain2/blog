import React from 'react';
import { FiClock, FiUser,FiEye } from 'react-icons/fi';

const BlogCard = ({ 
  blog, 
  categoryColors, 
  actions = null,
  showAuthor = true ,
  setSelectedBlog
}) => {
  return (
    <div className="bg-gray-800 cursor-pointer rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col" >
      
      {blog.blogImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={`/images/${blog.blogImage}`}
            alt={blog.title}
            className="w-full h-full object-contain md:object-cover"
           
          />
        </div>
      )}

      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs px-2 py-1 md:px-3 md:py-1 rounded-full ${categoryColors[blog.category] || 'bg-gray-700/30 text-gray-400'}`}>
            {blog.category}
          </span>
          {actions && <div className="flex space-x-1">{actions}</div>}
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-semibold mb-2 line-clamp-2">
          {blog.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 mb-4 text-sm md:text-base line-clamp-3 flex-grow">
          {blog.description}
        </p>

        {/* Footer - Author and Date */}
        <div className="flex items-center justify-between text-xs md:text-sm text-gray-400 mt-auto">
          {showAuthor && (
            <div className="flex items-center">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mr-2 flex items-center justify-center">
                <FiUser className="text-white text-xs" />
              </div>
              <span>{blog.createdBy?.username || 'Unknown'}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <span>{blog.date || new Date(blog.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <div className="flex items-center">
              <FiClock className="mr-1" />
              <span>{blog.readTime || `${Math.ceil(blog.description.length / 1000)} min read`}</span>
            </div>
          </div>
        </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
          <button
            onClick={() => setSelectedBlog(blog)}
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition"
            >
            <FiEye className="mr-1" />
            View Blog
          </button>
          </div>
              </div>
    </div>
  );
};

export default BlogCard;