// controllers/blogController.ts
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { BlogPost } from "../model/BlogPost";

const createBlogPost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, description, image, video } = req.body;

    // Validate incoming data
    if (!title || !description) {
      res.status(404).json({ message: "Title and description are required" });
      return; // Exit the function to prevent further execution
    }

    // Create a new blog post with optional fields
    const newPost = new BlogPost({ title, description, image, video });

    try {
      const savedPost = await newPost.save();
      console.log("Saved Post:", savedPost); // Log the saved post
      res.status(200).json(savedPost); // Send response with created blog post
    } catch (error: any) {
      console.error("Error saving blog post:", error);
      res
        .status(500)
        .json({ message: "Error saving blog post", error: error.message });
    }
  }
);

// Get all blog posts
const getAllBlogPosts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const blogPosts = await BlogPost.find(); // Fetch all blog posts from the database
      res.status(200).json(blogPosts); // Send back the blog posts as a response
    } catch (error: any) {
      console.error("Error fetching blog posts:", error);
      res
        .status(500)
        .json({ message: "Error fetching blog posts", error: error.message });
    }
  }
);

// Get a blog post by ID
const getBlogPostById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
      const blogPost = await BlogPost.findById(id); // Fetch the blog post by ID

      if (!blogPost) {
        res.status(404).json({ message: "Blog post not found" }); // If not found, return 404
        return;
      }

      res.status(200).json(blogPost); // Send the blog post as a response
    } catch (error: any) {
      console.error("Error fetching blog post:", error);
      res
        .status(500)
        .json({ message: "Error fetching blog post", error: error.message });
    }
  }
);

// Update a blog post by ID
const updateBlogPost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Get the ID from the request parameters
    const { title, description, image, video } = req.body; // Get updated data from request body

    // Validate incoming data
    if (!title && !description && !image && !video) {
      res.status(400).json({
        message:
          "At least one field (title, description, image, video) must be provided to update.",
      });
      return; // Exit the function if no fields are provided
    }

    // Find the blog post by ID
    const post = await BlogPost.findById(id);
    if (!post) {
      res.status(404).json({ message: "Blog post not found" });
      return; // Exit if the post doesn't exist
    }

    // Update the blog post fields if provided
    if (title) post.title = title;
    if (description) post.description = description;
    if (image) post.image = image;
    if (video) post.video = video;

    const updatedPost = await post.save(); // Save the updated post

    res.status(200).json(updatedPost); // Send response with updated blog post
  }
);

// Delete a blog post by ID
const deleteBlogPost = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Get the ID from the request parameters

    // Find the blog post by ID
    const post = await BlogPost.findById(id);
    if (!post) {
      res.status(404).json({ message: "Blog post not found" });
      return; // Exit if the post doesn't exist
    }

    await BlogPost.deleteOne({ _id: id }); // Use deleteOne to remove the blog post

    res.status(200).json({ message: "Blog post deleted successfully" }); // Send success response
  }
);

export {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
};
