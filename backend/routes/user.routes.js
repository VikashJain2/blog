import express from "express";
import {
  fetchUserInfo,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";

const userRouter = express.Router();

// Register User route with validation
userRouter.post(
  "/register", upload.single("profileImage"),
  registerUser
);

// Login User route with validation
userRouter.post(
  "/login",
  loginUser
);

userRouter.get("/fetchUser", fetchUserInfo)

// Logout User route (no validation needed here)
userRouter.get("/logout", logoutUser);

export default userRouter;
