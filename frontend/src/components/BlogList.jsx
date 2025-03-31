import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import BlogCard from './BlogCard';

const BlogList = ({ 
  blogs, 
  categoryColors, 
  onEdit, 
  onDelete, 
  onCreateNew,
  setSelectedBlog
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold">My Blogs</h2>
        <p className="text-gray-400">
          {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
        </p>
      </div>
      
      {blogs.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-6 md:p-8 text-center">
          <p className="text-gray-400 mb-4">You haven't created any blog posts yet</p>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition"
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {blogs.map((blog) => (
            <BlogCard
            setSelectedBlog={setSelectedBlog}
              key={blog._id}
              blog={blog}
              categoryColors={categoryColors}
              actions={
                <div className="flex space-x-1 md:space-x-2">
                  <button
                    onClick={() => onEdit(blog)}
                    className="text-gray-400 hover:text-blue-400 transition p-1 md:p-2 rounded-full hover:bg-gray-700"
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => onDelete(blog._id)}
                    className="text-gray-400 hover:text-red-400 transition p-1 md:p-2 rounded-full hover:bg-gray-700"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;