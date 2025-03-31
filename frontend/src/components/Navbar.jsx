import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { axiosInstance } from '../utils/axiosInstance';
import { summaryApi } from '../utils/summaryAPI';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/summaryAPI';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance({
          method: summaryApi.getProfile.method,
          url: summaryApi.getProfile.path+`?userId=${localStorage.getItem('userId')}`
        });
        
        if (response.data.success) {
          setUserProfile(response.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await axiosInstance({
        method: summaryApi.logout.method,
        url: summaryApi.logout.path
      });

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Navbar Left Side */}
        <div className="text-2xl font-bold">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            My Dashboard
          </h1>
        </div>

        {/* Navbar Right Side - User Profile */}
        <div className="relative">
          {/* Profile Image Button */}
          <button
            onClick={toggleMenu}
            className="flex items-center hover:text-neutral-400 transition-all duration-300 rounded-full hover:bg-gray-700/50"
          >
            {userProfile?.profileImage ? (
              <img 
                src={"/images/"+userProfile.profileImage} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
              />
            ) : (
              <FaUserCircle className="text-3xl" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-3 bg-gray-800/90 backdrop-blur-md p-2 rounded-lg shadow-xl w-48 transform scale-95 transition-all duration-300 ease-out">
              <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                {userProfile?.username || 'User'}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-white hover:text-red-500 w-full py-2 px-4 rounded-md transition-all duration-300 ease-in-out hover:bg-gray-700/50"
              >
                <FaSignOutAlt className="mr-3 text-lg" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;