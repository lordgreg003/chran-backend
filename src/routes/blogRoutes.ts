// routes/blogRoutes.ts
import express from "express";
import {
  createBlogPost,
  deleteBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  // searchBlogPosts,
  updateBlogPost,
} from "../controllers/blogController";

const router = express.Router();

// Routes for blog posts
router.post("/", createBlogPost); // Admin: Create a new blog post

// Route to get all blog posts
router.get("/", getAllBlogPosts);

router.get("/:id", getBlogPostById);

router.put("/:id", updateBlogPost);

// Route to delete a blog post by ID
router.delete("/:id", deleteBlogPost);

// Search for blog posts
// router.get("/search", searchBlogPosts);

export default router;
