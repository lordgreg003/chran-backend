import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import blogRoutes from "./routes/blogRoutes";
// import newBlogRoute from "./routes/newBlogRoute";
import authRoutes from "./routes/adminRoutes";
import articleRoutes from "./routes/articleRoutes";
import errorMiddleware from "./middlewares/errorMiddleware";
import connectDB from "./config/connectDB";

 connectDB();

 const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use blog routes
app.get("/", (req: Request, res: Response) => {
  const title = "My Awesome Blog Post"; // 
  const description = "This is a detailed description of the blog post.";  
  const imageUrl = "https://example.com/image.jpg"; 
  const fullUrl = `https://example.com/blog/${req.params.slug}`;

  res.render("blogPost", {
    title,
    description,
    imageUrl,
    fullUrl,
  });
});
app.use("/api/blogs", blogRoutes);
// app.use("/api/newblog",newBlogRoute)
app.use("/api/article", articleRoutes)
app.use("/admin/", authRoutes);

 app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

 const PORT = Number(process.env.PORT) || 3001;

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
