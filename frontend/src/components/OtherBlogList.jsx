import React from 'react';
import BlogCard from './BlogCard';

const OthersBlogList = ({ 
  blogs, 
  categoryColors,
  setSelectedBlog
}) => {

  return (
    <div>
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold">Others' Blogs</h2>
        <p className="text-gray-400">
          {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-400">No blogs found from other users</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {blogs.map((blog) => (
            <BlogCard
            setSelectedBlog={setSelectedBlog}
              key={blog._id}
              blog={blog}
              categoryColors={categoryColors}
              showAuthor={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OthersBlogList;