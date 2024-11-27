import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import path from "path";

import cors from "cors";
import bodyParser from "body-parser";
import blogRoutes from "./routes/blogRoutes";
import authRoutes from "./routes/adminRoutes";
import errorMiddleware from "./middlewares/errorMiddleware";
import connectDB from "./config/connectDB";

// Connect to the database
connectDB();

// Create Express app
const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use blog routes
app.get("/", (req: Request, res: Response) => {
  const title = "My Awesome Blog Post"; // Replace with actual title from database
  const description = "This is a detailed description of the blog post."; // Replace with actual description
  const imageUrl = "https://example.com/image.jpg"; // Replace with actual image URL
  const fullUrl = `https://example.com/blog/${req.params.slug}`;

  res.render("blogPost", {
    title,
    description,
    imageUrl,
    fullUrl,
  });
});
app.use("/api/blogs", blogRoutes);
app.use("/admin/", authRoutes);

// Error handling middleware
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

// Set up the port for deployment
const PORT = Number(process.env.PORT) || 3001;

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
