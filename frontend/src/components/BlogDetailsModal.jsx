import React from 'react';
import { FiX, FiClock, FiUser } from 'react-icons/fi';

const BlogDetailsModal = ({ blog, onClose, categoryColors }) => {
  if (!blog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{blog.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          
          {blog.blogImage && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img
                src={`/images/${blog.blogImage}`}
                alt={blog.title}
                className="w-full h-auto max-h-96 object-cover"
                
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <span className={`text-sm px-3 py-1 rounded-full ${categoryColors[blog.category] || 'bg-gray-700/30 text-gray-400'}`}>
              {blog.category}
            </span>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <FiUser className="mr-2" />
                <span>{blog.createdBy?.username || 'Unknown'}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-2" />
                <span>{blog.readTime || `${Math.ceil(blog.description.length / 1000)} min read`}</span>
              </div>
              <span>{blog.date || new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-line text-gray-300">
              {blog.description}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-800 p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsModal;