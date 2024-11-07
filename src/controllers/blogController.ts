// controllers/blogController.ts
import { Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler";
import { BlogPost } from "../model/BlogPost";
import cloudinary from "../config/cloudinary";
import * as stream from "stream";

const createBlogPost: RequestHandler = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;

    // Initialize variables for media URL and type
    let mediaUrl = "";
    let mediaType = "";

    if (req.file) {
      // Convert the Cloudinary upload to a Promise to await it
      const uploadToCloudinary = () => {
        return new Promise<{ mediaUrl: string; mediaType: string }>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: "auto", // Automatically detects and handles images or videos
                folder: "blog_posts", // Folder in Cloudinary
              },
              (error, result) => {
                if (error) {
                  return reject(
                    new Error("Error uploading file to Cloudinary")
                  );
                }
                if (result) {
                  resolve({
                    mediaUrl: result.secure_url,
                    mediaType: result.resource_type,
                  });
                }
              }
            );

            // Stream the file buffer to Cloudinary
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file?.buffer); // Use optional chaining to handle undefined
            bufferStream.pipe(uploadStream);
          }
        );
      };

      // Await the Cloudinary upload and set mediaUrl and mediaType
      const uploadResult = await uploadToCloudinary();
      mediaUrl = uploadResult.mediaUrl;
      mediaType = uploadResult.mediaType;
    }

    // Create a new blog post instance with media URL and type
    const newPost = new BlogPost({
      title,
      description,
      mediaUrl,
      mediaType,
    });

    // Save the new post to MongoDB
    await newPost.save();

    // Respond with success
    res
      .status(201)
      .json({ message: "Blog post created successfully", newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating blog post" });
  }
});
// Get all blog posts
const getAllBlogPosts: RequestHandler = asyncHandler(async (req, res) => {
  try {
    // Fetch all blog posts from the database, sorted by creation date (newest first)
    const blogPosts = await BlogPost.find().sort({ createdAt: -1 });

    // Respond with the blog posts
    res
      .status(200)
      .json({ message: "Blog posts retrieved successfully", blogPosts });
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
    // if (title) post.title = title;
    // if (description) post.description = description;
    // if (image) post.image = image;
    // if (video) post.video = video;

    const updatedPost = await post.save(); // Save the updated post

    res.status(200).json(updatedPost); // Send response with updated blog post
  }
);

// Delete a blog post by ID
// const deleteBlogPost = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {// const deleteBlogPost = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const { id } = req.params;

//     // Find the blog post by ID
//     const post = await BlogPost.findById(id);
//     if (!post) {
//       return res.status(404).json({ error: "Blog post not found" });
//     }

//     // If there is a media URL, delete the media from Cloudinary
//     if (post.mediaUrl) {
//       const publicId = post.mediaUrl.split("/").pop()?.split(".")[0];
//       if (publicId) {
//         await cloudinary.uploader.destroy(`blog_posts/${publicId}`, {
//           resource_type: post.mediaType,
//         });
//       }
//     }

//     // Delete the blog post from MongoDB
//     await BlogPost.findByIdAndDelete(id);

//     // Respond with success
//     res.status(200).json({ message: "Blog post deleted successfully" });
//   } catch (error) {
//     next(error); // Pass the error to the next middleware
//   }
// };

export {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  // deleteBlogPost,
};
