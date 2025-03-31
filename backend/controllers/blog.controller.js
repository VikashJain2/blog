

import blogService from "../services/blog.service.js";

import BlogModel from "../models/blog.model.js";
const createBlog = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const blogImage = req.file.filename
    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const response = await blogService.createBlog({
      title,
      description,
      blogImage,
      category,
      userId: req.user.userId,
    });

    if (response.success === false) {
      return res
        .status(400)
        .json({ success: response.success, message: response.message });
    }
    return res.status(201).json({
      success: response.success,
      message: response.message,
      newTask: response.task,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || error });
  }
};
const getBlogByUserId = async (req, res) => {
  try {
    const  userId = req.params.id;
    const response = await blogService.getBlogById({ userId });
    if (!response.success) {
      return res.status(response.status).json({ success: response.success, message: response.message });
    }
    return res.status(response.status).json({ success: response.success, blogs: response.Blogs });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || error });
  }
};

const getOthersBlogs = async(req,res)=>{
  try{
    const currentUser = req.user.userId
    const Blogs = await BlogModel.find({createdBy: {$ne: currentUser}}).populate("createdBy","username")


   return res.status(200).json({success: true, blogs: Blogs})

  }catch(error){
    return res.status(500).json({success: false, message: error.message || error})
  }
}

const updateSpecificBlog = async (req, res) => {
  try {
    const BlogId = req.params.id;
    console.log(BlogId)
    const { title, description, category } = req.body;
    const blogImage = req?.file?.filename

    const response = await blogService.updateBlog({
      BlogId,
      title,
      description,
      category,
      blogImage
    })
    console.log("response", response);
    if (!response.success) {
      return res.status(response.status).json({ success: response.success, message: response.message });
    }
    return res.status(response.status).json({ success: response.success, message: response.message, data: response.task });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: error.message || error });
  }
};

const delateSpecificBlog = async (req, res) => {
  try {
    const BlogId = req.params.id;
    const response = await blogService.deleteBlog({ BlogId });
    return res.status(response.status).json({ success: response.success, message: response.message});
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || error });
  }
};
export {
  createBlog,
  getBlogByUserId,
  getOthersBlogs,
  delateSpecificBlog,
  updateSpecificBlog
};
