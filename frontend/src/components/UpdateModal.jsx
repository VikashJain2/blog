import React, { useState, useRef } from 'react';
import { FiImage } from 'react-icons/fi';
import { axiosInstance } from '../utils/axiosInstance';
import { summaryApi } from '../utils/summaryAPI';
import toast from 'react-hot-toast';
import { z } from 'zod';

const updateBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  category: z.string().min(1, "Please select a category"),
});

const UpdateModal = ({ 
  blog, 
  closeUpdateModal, 
  fetchMyBlog,
  categories 
}) => {
  const [formData, setFormData] = useState({
    title: blog.title,
    description: blog.description,
    category: blog.category
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(blog.blogImage ? `/images/${blog.blogImage}` : '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      const fileUrl = URL.createObjectURL(file);
      setImage(file);
      setImagePreview(fileUrl);
      setErrors({ ...errors, image: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      updateBlogSchema.parse(formData);

      const blogData = new FormData();
      blogData.append("title", formData.title);
      blogData.append("description", formData.description);
      blogData.append("category", formData.category);
      
        blogData.append("blogImage", image);
      

      const response = await axiosInstance({
        method: summaryApi.updateBlog.method,
        url: `${summaryApi.updateBlog.path}/${blog._id}`,
        data: blogData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchMyBlog();
        closeUpdateModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Handle validation errors
        const formErrors = err.errors.reduce((acc, { path, message }) => {
          acc[path[0]] = message;
          return acc;
        }, {});
        setErrors(formErrors);
      } else if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred while updating the blog");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <h3 className="text-xl font-semibold mb-4">Update Blog</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                  errors.title ? "border-red-500" : ""
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                  errors.category ? "border-red-500" : ""
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-400">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Blog Image</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition flex items-center"
                >
                  <FiImage className="mr-2" />
                  Upload Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden"
                />
                {imagePreview && (
                  <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-600">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="mt-1 text-sm text-red-400">{errors.image}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                  errors.description ? "border-red-500" : ""
                }`}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={closeUpdateModal}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg transition ${
                isSubmitting
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;