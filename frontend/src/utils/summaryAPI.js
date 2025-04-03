export const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const summaryApi = {
  register: {
    path: "/api/auth/register",
    method: "POST",
  },
  login: {
    path: "/api/auth/login",
    method: "POST",
  },
  getProfile:{
    path: "/api/auth/fetchUser",
    method:"get"
  },
  logout:{
    path: "/api/auth/logout",
    method: "GET"
  },
  getBlogs:{
    path: "/blog/get-blogs",
    method: "GET"
  },
  addBlog:{
    path: "/blog/create-blog",
    method: "POST"
  },
  delateBlog:{
    path: '/blog/delete-blog',
    method: "DELETE"
  },
  updateBlog:{
    path: "/blog/update-blog",
    method: "PUT"
  },

};
