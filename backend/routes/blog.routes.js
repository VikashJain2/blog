import express from "express";
import { body, param, validationResult } from "express-validator"; // Import express-validator
import {
  createBlog,
  delateSpecificBlog,
  getBlogByUserId,
  getOthersBlogs,
  updateSpecificBlog,
 
} from "../controllers/blog.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";

const blogRouter = express.Router();

// Routes
blogRouter.post("/create-blog",upload.single("blogImage"), authMiddleware, createBlog);
blogRouter.get("/get-blogs", authMiddleware, getOthersBlogs);
blogRouter.get("/get-blogs/:id", authMiddleware, getBlogByUserId);
blogRouter.put("/update-blog/:id",upload.single("blogImage"), authMiddleware, updateSpecificBlog);
blogRouter.delete("/delete-blog/:id", authMiddleware, delateSpecificBlog);

export default blogRouter;
