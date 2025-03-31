import multer from "multer";
import fs from "fs";
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

export const upload = multer({
  storage,
});
