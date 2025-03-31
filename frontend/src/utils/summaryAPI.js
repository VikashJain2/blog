export const BASE_URL = "http://localhost:3002";

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
