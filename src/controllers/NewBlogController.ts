// import { Request, Response } from "express";
// import Blog, { IBlog } from "../model/NewBlogPostModel";
// import mongoose from "mongoose";
// import generateSlug from "../utils/generateSlug";
// import cloudinary from "../config/cloudinary";

// export const createBlog = async (req: Request, res: Response) => {
//   try {
//     const {
//       title,
//       author,
//       content,
//       category,
//       tags,
//       status,
//       published_at,
//       description,
//     } = req.body;

//     // Check if description is provided
//     if (!description) {
//       return res.status(400).json({ error: "Description is required." });
//     }

//     // Check if title and author are provided
//     if (!title || !author) {
//       return res.status(400).json({ error: "Title and author are required." });
//     }

//     // Generate slug from title
//     const slug = generateSlug(title);

//     // Upload images/videos to Cloudinary
//     const uploadToCloudinary = async (file: Express.Multer.File) => {
//       try {
//         const result = await cloudinary.uploader.upload(file.path);
//         return result.secure_url;
//       } catch (error) {
//         console.error(
//           `Failed to upload ${file.fieldname} to Cloudinary:`,
//           error
//         );
//         return null;
//       }
//     };

//     const uploadedMedia: { [key: string]: string } = {};
//     const mediaFields = [
//       "featured_image",
//       "image1",
//       "image2",
//       "image3",
//       "image4",
//       "image5",
//       "image6",
//       "video",
//     ];

//     if (req.files) {
//       const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//       for (const field of mediaFields) {
//         if (files[field]) {
//           const url = await uploadToCloudinary(files[field][0]);
//           if (url) {
//             uploadedMedia[field] = url;
//           }
//         }
//       }
//     }

//     // Create new blog post
//     const blogData: Partial<IBlog> = {
//       title,
//       slug,
//       author: new mongoose.Types.ObjectId(author), // Convert author to ObjectId
//       content,
//       category: category ? new mongoose.Types.ObjectId(category) : undefined, // Convert category to ObjectId
//       tags: tags
//         ? tags.map((tag: string) => new mongoose.Types.ObjectId(tag))
//         : undefined, // Convert tags to ObjectId array
//       status: status || "draft",
//       published_at: published_at ? new Date(published_at) : undefined,
//       ...uploadedMedia,
//     };

//     const blog = new Blog(blogData);
//     const savedBlog = await blog.save();
//     res.status(201).json(savedBlog);
//   } catch (error) {
//     console.error("Error creating blog post:", error);
//     res.status(500).json({ error: "Failed to create blog post." });
//   }
// };

// // Get all blog posts
// export const getAllBlogs = async (_req: Request, res: Response) => {
//   try {
//     const blogs = await Blog.find().populate("author category tags");
//     res.status(200).json(blogs);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch blog posts." });
//   }
// };

// // Get a single blog post by ID
// export const getBlogById = async (req: Request, res: Response) => {
//   try {
//     const blog = await Blog.findById(req.params.id).populate(
//       "author category tags"
//     );
//     if (!blog) {
//       return res.status(404).json({ error: "Blog post not found." });
//     }
//     res.status(200).json(blog);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch the blog post." });
//   }
// };

// // Update a blog post
// export const updateBlog = async (req: Request, res: Response) => {
//   try {
//     const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedBlog) {
//       return res.status(404).json({ error: "Blog post not found." });
//     }
//     res.status(200).json(updatedBlog);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update the blog post." });
//   }
// };

// // Delete a blog post
// export const deleteBlog = async (req: Request, res: Response) => {
//   try {
//     const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
//     if (!deletedBlog) {
//       return res.status(404).json({ error: "Blog post not found." });
//     }
//     res.status(200).json({ message: "Blog post deleted successfully." });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete the blog post." });
//   }
// };
