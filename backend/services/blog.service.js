import BlogModel from "../models/blog.model.js";
import Task from "../models/blog.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
const createBlog = async ({
  title,
  description,
  category,
  blogImage,
  userId,
}) => {
  try {
    const newBlog = await BlogModel.create({
      title,
      description,
      category,
      blogImage,
      createdBy: userId,
    });

    const updateUser = await User.findByIdAndUpdate(userId, {
      $push: { Blogs: newBlog._id },
    });

    if (updateUser.isModified) {
      console.log("User Modified");
    } else {
      console.log("User not Modified");
    }

    return {
      blog: newBlog,
      success: true,
      message: "Blog Created SuccessFully",
    };
  } catch (error) {
    throw new Error(error);
  }
};
const getBlogById = async ({userId}) => {
  try {
    if (!userId) {
      return {
        status: 400,
        success: false,
        message: "User ID is required",
      };
    }
    const Blogs = await BlogModel.find({ createdBy:new mongoose.Types.ObjectId(userId) }).populate({
      path: "createdBy",
      select: "username"
    });
    if (!Blogs) {
      return {
        status: 404,
        success: false,
        message: "Blog not found",
      };
    }
    return {
      status: 200,
      success: true,
      Blogs,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const updateBlog = async ({
  BlogId,
  title,
  description,
  category,
  blogImage
}) => {
  try {
    if (!BlogId) {
      return {
        status: 400,
        success: false,
        message: "Blog ID is required",
      };
    }
    const Blog = await BlogModel.findById(BlogId);
    if (!Blog) {
      return {
        status: 404,
        success: false,
        message: "Blog not found",
      };
    }
    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      ...(blogImage && { blogImage }),
    };

    const updatedBlog = await BlogModel.findByIdAndUpdate(BlogId, updateData, {
      new: true,
    });
    return {
      status: 200,
      success: true,
      task: updatedBlog,
      message: "Blog updated successfully",
    };
  } catch (error) {
    throw new Error(error);
  }
};

const deleteBlog = async ({ BlogId }) => {
  try {
    if (!BlogId) {
      return {
        status: 400,
        success: false,
        message: "Blog ID is required",
      };
    }
    const blog = await BlogModel.findByIdAndDelete(BlogId);
    if (!blog) {
      return {
        status: 404,
        success: false,
        message: "blog not found",
      };
    }
    return {
      status: 200,
      success: true,
      message: "blog deleted successfully",
    };
  } catch (error) {
    throw new Error(error);
  }
};
export default {
  createBlog,
  getBlogById,
  updateBlog,
 deleteBlog
};
