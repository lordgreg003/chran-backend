// routes/blogRoutes.ts
import express from "express";
import {
  createBlogPost,
  deleteBlogPostById,
    getAllBlogPosts,
  getBlogPostBySlug
 // updateBlogPost,
} from "../controllers/blogController";
import { upload } from "../config/multerConfig";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ]),
  createBlogPost
);

// Route to get all blog posts
router.get("/", getAllBlogPosts);

router.get("/:slug", getBlogPostBySlug);

// router.put("/:id", upload.array("media", 3),  updateBlogPost);

// // Route to delete a blog post by ID
router.delete("/:id", deleteBlogPostById);

// Search for blog posts
// router.get("/search", searchBlogPosts);

export default router;
