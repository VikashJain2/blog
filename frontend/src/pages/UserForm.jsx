import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";
import { z } from "zod";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";
import { summaryApi } from "../utils/summaryAPI";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const registrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password should be at least 6 characters long."),
  profileImage: z.instanceof(File).optional(),
});

const UserForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const toggleFormMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "", username: "", profileImage: null });
    setPreviewImage(null);
    setErrors({});
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const fileUrl = URL.createObjectURL(file);
      setPreviewImage(fileUrl);
      if (errors.profileImage) {
        setErrors({ ...errors, profileImage: null });
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const schema = isLogin ? loginSchema : registrationSchema;

    try {
      schema.parse(formData);

      const dataToSend = new FormData();
      dataToSend.append("email", formData.email);

      if (!isLogin) {
        dataToSend.append("username", formData.username);
        dataToSend.append("password", formData.password);
        if (formData.profileImage) {
          dataToSend.append("profileImage", formData.profileImage);
        }
      } else {
        dataToSend.append("password", formData.password);
      }

      const response = await axiosInstance({
        method: summaryApi[isLogin ? "login" : "register"].method,
        url: summaryApi[isLogin ? "login" : "register"].path,
        data: isLogin ? formData : dataToSend,
        headers: isLogin ? {} : { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        setFormData({
          email: "",
          password: "",
          username: "",
          profileImage: null,
        });
        setPreviewImage(null);
        navigate(`/dashboard/${response.data.userId}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formErrors = err.errors.reduce((acc, { path, message }) => {
          acc[path[0]] = message;
          return acc;
        }, {});
        console.log(formErrors);
        setErrors(formErrors);
      } else {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.msg);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const userId = localStorage.getItem("userId");
      navigate(`/dashboard/${userId}`);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-xl">
        <h2 className="text-4xl font-semibold text-center mb-6 text-indigo-400">
          {isLogin ? "Login to Task Manager" : "Register for Task Manager"}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-6">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full p-4 mt-2 text-sm bg-gray-700 text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 ${
                    errors.username ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-xs text-red-500">{errors.username}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Image (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden border-2 border-indigo-500">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                          <span className="text-xs text-gray-400">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="flex-1">
                    <div className="flex items-center justify-center w-full px-4 py-2 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition duration-300">
                      <FaUpload className="mr-2" />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
                {errors.profileImage && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.profileImage}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-4 mt-2 text-sm bg-gray-700 text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full p-4 mt-2 text-sm bg-gray-700 text-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {isPasswordVisible ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="mb-6 text-center">
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
                </div>
              ) : isLogin ? (
                "Login"
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleFormMode}
              className="text-indigo-400 hover:underline"
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
