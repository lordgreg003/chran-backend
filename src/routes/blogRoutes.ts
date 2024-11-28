// routes/blogRoutes.ts
import express from "express";
import {
  createBlogPost,
  deleteBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
} from "../controllers/blogController";
import { upload } from "../config/multerConfig";

const router = express.Router();

// Routes for blog posts
router.post("/", upload.array("media", 3), createBlogPost);

// Route to get all blog posts
router.get("/", getAllBlogPosts);

router.get("/:slug", getBlogPostBySlug);

router.put("/:id", upload.array("media", 3),  updateBlogPost);

// Route to delete a blog post by ID
router.delete("/:id", deleteBlogPost);

// Search for blog posts
// router.get("/search", searchBlogPosts);

export default router;
