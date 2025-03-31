import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import { connectDB } from "./config/connectdb.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import helmet from 'helmet'
dotenv.config();
app.use(express.json());
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", userRouter)
app.use("/images", express.static("uploads"))
app.use("/blog", blogRouter)

app.listen(port, () => {
  connectDB()
    .then(() => {
      console.log(`Server is running on http://localhost:${port}`);
    })
    .catch((error) => {
      console.log("Error connecting to database", error.message);
      process.exit(1);
    });
});
