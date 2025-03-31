import React from 'react';
import { FiFileText, FiUsers, FiPlus } from 'react-icons/fi';

const Sidebar = ({ 
  activeView, 
  setActiveView, 
  sidebarOpen, 
  setSidebarOpen,
  setNewBlog
}) => {
  const navItems = [
    {
      id: 'my-blogs',
      label: 'My Blogs',
      icon: <FiFileText className="mr-3" />,
      action: () => {
        setActiveView('my-blogs');
        setSidebarOpen(false);
      }
    },
    {
      id: 'others-blogs',
      label: "Others' Blogs",
      icon: <FiUsers className="mr-3" />,
      action: () => {
        setActiveView('others-blogs');
        setSidebarOpen(false);
      }
    },
    {
      id: 'create-blog',
      label: 'Create New Blog',
      icon: <FiPlus className="mr-3" />,
      action: () => {
        setActiveView('create-blog');
        setNewBlog({
          title: '',
          description: '',
          category: 'Programming',
          image: null,
          imagePreview: ''
        });
        setSidebarOpen(false);
      }
    }
  ];

  return (
    <div 
      className={`w-64 bg-gray-800 border-r border-gray-700 p-4 fixed md:static inset-y-0 left-0 z-40 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <h2 className="text-xl font-bold mb-6 pt-4 flex items-center">
        <span className="bg-gradient-to-r from-purple-400 to-blue-500 w-2 h-8 rounded-full mr-3"></span>
        Blog Dashboard
      </h2>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
              activeView === item.id
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;