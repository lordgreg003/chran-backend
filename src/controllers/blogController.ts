// controllers/blogController.ts
import { Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler";
import { BlogPost } from "../model/BlogPost";
import cloudinary from "../config/cloudinary";
import * as stream from "stream";
import { startOfWeek, endOfWeek } from 'date-fns';  // Import date-fns methods

interface MediaItem {
  url: string;
  type: string;
}

interface MediaItem {
  url: string;
  type: string;
}

const createBlogPost: RequestHandler = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;

    // Array to store media URLs and types
    const media = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        // Upload to Cloudinary with resource type auto
        const uploadResult = await new Promise<{ url: string; type: string }>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: "auto", // Automatically handle images and videos
                folder: "blog_posts",
                transformation: file.mimetype.startsWith("image")
                  ? [
                      {
                        width: 300,
                        height: 300,
                        crop: "limit",
                        quality: "auto:best",
                      },
                    ]
                  : undefined, // Optional: Add video transformations if needed
              },
              (error, result) => {
                if (error) {
                  return reject(new Error("Failed to upload to Cloudinary"));
                }
                if (result) {
                  resolve({
                    url: result.secure_url,
                    type: result.resource_type,
                  });
                }
              }
            );

            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);
            bufferStream.pipe(uploadStream);
          }
        );

        // Add the uploaded media info to the media array
        media.push(uploadResult);
      }
    }

    // Create a new blog post
    const newPost = new BlogPost({
      title,
      description,
      media, // Save the array of media objects
    });

    // Save to MongoDB
    await newPost.save();

    res.status(201).json({ message: "Blog post created successfully", newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating blog post" });
  }
});
// Get all blog posts
const getAllBlogPosts: RequestHandler = asyncHandler(async (req, res) => {
  try {
    // Pagination logic
    const page = parseInt(req.query.page as string) || 1;  // Default to page 1 if not provided
    const limit = parseInt(req.query.limit as string) || 10;  // Default to 10 posts per page
    const skip = (page - 1) * limit;  // Calculate the number of posts to skip for pagination

    // Calculate start and end of the week to filter posts by the current week using date-fns
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 0 });  // Sunday as the start of the week
    const endOfCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 0 });  // Sunday as the start of the week

    // Fetch the blog posts for the current week, sorted by createdAt (newest first)
    const blogPosts = await BlogPost.find({
      createdAt: { $gte: startOfCurrentWeek, $lte: endOfCurrentWeek }, // Filter for current week
    })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit);

    // Calculate the total number of blog posts for pagination
    const totalBlogPosts = await BlogPost.countDocuments({
      createdAt: { $gte: startOfCurrentWeek, $lte: endOfCurrentWeek }, // Same filter for counting
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalBlogPosts / limit);

    // Send the response with the paginated blog posts
    res.status(200).json({
      message: "Blog posts retrieved successfully",
      blogPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogPosts,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching blog posts" });
  }
});

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
const updateBlogPost: RequestHandler = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, updatedMedia } = req.body;

    // Find blog post by ID
    const blogPost = await BlogPost.findById(id);
    if (!blogPost) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }

    // Handle media updates
    const currentMedia = blogPost.media || [];

    // Upload new media
    const newMedia: { url: string; type: string }[] = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const uploadResult = await new Promise<{ url: string; type: string }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: "blog_posts",
            },
            (error, result) => {
              if (error) return reject(error);
              if (result) resolve({ url: result.secure_url, type: result.resource_type });
            }
          );

          const bufferStream = new stream.PassThrough();
          bufferStream.end(file.buffer);
          bufferStream.pipe(uploadStream);
        });

        newMedia.push(uploadResult);
      }
    }

    // Remove unused media from Cloudinary
    for (const mediaItem of currentMedia) {
      if (!updatedMedia?.includes(mediaItem.url)) {
        const publicId = mediaItem.url.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: mediaItem.type });
      }
    }

    // Update blog post
    blogPost.title = title || blogPost.title;
    blogPost.description = description || blogPost.description;
    blogPost.media = [
      ...newMedia,
      ...currentMedia.filter((media) => updatedMedia?.includes(media.url)),
    ];

    const updatedPost = await blogPost.save();

    res.status(200).json({
      message: "Blog post updated successfully",
      updatedPost,
    });
  } catch (error) {
    next(error);
  }
});


// Delete blog post by ID


const deleteBlogPost: RequestHandler = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch the blog post by ID
    const blogPost = await BlogPost.findById(id);

    if (!blogPost) {
      res.status(404).json({ error: "Blog post not found" });
      return; // Exit after sending a response
    }

    // Delete associated media
    if (blogPost.media && Array.isArray(blogPost.media)) {
      for (const mediaItem of blogPost.media as MediaItem[]) {
        const publicId = mediaItem.url.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(publicId, {
          resource_type: mediaItem.type,
        });
      }
    }
    await BlogPost.deleteOne({ _id: blogPost._id });
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    next(error);  
  }
});
export {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
};
