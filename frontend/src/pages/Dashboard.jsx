import React, { useState, useRef, useEffect } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { summaryApi } from "../utils/summaryAPI";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import Sidebar from "../components/SideBar";
import BlogList from "../components/BlogList";
import UpdateModal from "../components/UpdateModal";
import DeleteModal from "../components/DeleteModal";
import { FiImage, FiMenu, FiX } from "react-icons/fi";
import OthersBlogList from "../components/OtherBlogList";
import BlogDetailsModal from "../components/BlogDetailsModal"
const BlogDashboard = () => {
  const [activeView, setActiveView] = useState("my-blogs");
  const [myBlogs, setMyBlogs] = useState([]);
  const [othersBlogs, setOthersBlogs] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: "",
    description: "",
    category: "Programming",
    image: null,
    imagePreview: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    "Programming",
    "Food",
    "Travel",
    "Lifestyle",
    "Technology",
  ];
  const categoryColors = {
    Programming: "bg-blue-900/30 text-blue-400",
    Food: "bg-emerald-900/30 text-emerald-400",
    Travel: "bg-purple-900/30 text-purple-400",
    Lifestyle: "bg-pink-900/30 text-pink-400",
    Technology: "bg-amber-900/30 text-amber-400",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBlog({
          ...newBlog,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const addBlog = async () => {
    // const blog = {
    //   id: Date.now(),
    //   title: newBlog.title,
    //   description: newBlog.description,
    //   author: 'You',
    //   date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    //   category: newBlog.category,
    //   readTime: `${Math.ceil(newBlog.description.length / 1000)} min read`,
    //   image: newBlog.imagePreview || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    // };
    const blogData = new FormData();

    blogData.append("title", newBlog.title);
    blogData.append("description", newBlog.description);
    blogData.append("category", newBlog.category);
    blogData.append("blogImage", newBlog.image);

    try {
      const response = await axiosInstance({
        method: summaryApi.addBlog.method,
        url: summaryApi.addBlog.path,
        data: blogData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fileInputRef.current.value = null;
        setNewBlog({
          title: "",
          description: "",
          category: "Programming",
          image: null,
          imagePreview: "",
        })
        setActiveView("my-blogs")
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
    setSidebarOpen(false);
  };

  const userId = useParams().id;
  const getUserBlogs = async () => {
    try {
      const response = await axiosInstance({
        method: summaryApi.getBlogs.method,
        url: `${summaryApi.getBlogs.path}/${
          activeView === "my-blogs" ? userId : ""
        }`,
      });

      if (response.data.success) {
        const formattedBlogs = response.data.blogs.map((blog) => ({
          ...blog,
          date: new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          readTime: `${Math.ceil(blog.description.length / 1000)} min read`,
        }));
        
       activeView === "my-blogs" ?setMyBlogs(formattedBlogs) : setOthersBlogs(formattedBlogs)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to fetch blogs");
      } else {
        toast.error("Network error while fetching blogs");
      }
      setMyBlogs([]);
    }
  };

  useEffect(() => {
    getUserBlogs();
  }, [activeView]);

  const editBlog = (blog) => {
    setCurrentBlog(blog);
    setOpenUpdateModal(true);
  };

  const deleteBlog = (id) => {
    setCurrentBlog(id);
    setOpenDeleteModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-900 text-gray-100">
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setNewBlog={setNewBlog}
        />

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 p-4 md:p-8 ml-0 transition-all duration-300">
        {activeView === "create-blog" && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">
                {"Create New Blog Post"}
              </h2>
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newBlog.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      placeholder="Your blog title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={newBlog.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Blog Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition flex items-center"
                      >
                        <FiImage className="mr-2" />
                        Upload Image
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      {newBlog.imagePreview && (
                        <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-600">
                          <img
                            src={newBlog.imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      name="description"
                      value={newBlog.description}
                      onChange={handleInputChange}
                      rows="8"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      placeholder="Write your description here..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3">
                
                      <button
                        onClick={addBlog}
                        disabled={!newBlog.title || !newBlog.description}
                        className={`px-4 py-2 rounded-lg transition ${
                          !newBlog.title || !newBlog.description
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90"
                        }`}
                      >
                        Publish Post
                      </button>
                  
                  </div>
                </div>
              </div>
            </div>
          )}
        
        

          {activeView === "my-blogs" && (
            <BlogList
              blogs={myBlogs}
              categoryColors={categoryColors}
              onEdit={editBlog}
              onDelete={deleteBlog}
              setSelectedBlog={setSelectedBlog}
              onCreateNew={() => {
                setActiveView("create-blog");
                setNewBlog({
                  title: "",
                  description: "",
                  category: "Programming",
                  image: null,
                  imagePreview: "",
                });
              }}
            />
          )}

          {activeView === "others-blogs" && (
            <OthersBlogList
            setSelectedBlog={setSelectedBlog}
              blogs={othersBlogs}
              categoryColors={categoryColors}
            />
          )}
        </div>
      </div>

      {openDeleteModal && (
        <DeleteModal
          blogId={currentBlog}
          closeDeleteModal={() => setOpenDeleteModal(false)}
          fetchMyBlog={getUserBlogs}
        />
      )}

      {openUpdateModal && (
        <UpdateModal
          blog={currentBlog}
          closeUpdateModal={() => setOpenUpdateModal(false)}
          fetchMyBlog={getUserBlogs}
          categories={categories}
        />
      )}

{selectedBlog && (
  <BlogDetailsModal 
    blog={selectedBlog} 
    onClose={() => setSelectedBlog(null)} 
    categoryColors={categoryColors}
  />
)}
    </>
  );
};

export default BlogDashboard;
