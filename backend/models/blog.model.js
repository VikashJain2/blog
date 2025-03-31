import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot be longer than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description cannot be longer than 500 characters"],
    },
    category: {
      type: String,
      required: true,
    },
    blogImage: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
  },
  { timestamps: true }
);

const BlogModel = mongoose.model("blog", blogSchema);

export default BlogModel;
