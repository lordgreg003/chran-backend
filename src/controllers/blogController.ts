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
                resource_type: "auto",
                folder: "blog_posts",
                transformation: [
                  {
                    width: 300,
                    height: 300,
                    crop: "limit",
                    quality: "auto:best",
                    fetch_format: "auto",
                  },
                ],
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
            bufferStream.end(req.file?.buffer);
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
// const updateBlogPost: RequestHandler = asyncHandler(
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       // Extract the blog post ID and the updated data from the request
//       const { id } = req.params;
//       const { title, description, mediaUrl, mediaType } = req.body;

//       // Log the received data
//       console.log('Updating post with ID:', id);
//       console.log('Updated data:', { title, description, mediaUrl, mediaType });

//       // Find the blog post by ID
//       const post = await BlogPost.findById(id);

//       // Check if the post exists
//       if (!post) {
//         res.status(404).json({ message: "Blog post not found" });
//         return;
//       }

//       // If there is media to update, delete the existing media from Cloudinary (if it exists)
//       if (mediaUrl && post.mediaUrl !== mediaUrl) {
//         const publicId = post.mediaUrl.split("/").pop()?.split(".")[0]; // Extract the public ID
//         if (publicId) {
//           await cloudinary.uploader.destroy(publicId); // Delete the previous media
//         }
//       }

//       // Update the blog post fields with the new data
//       post.title = title || post.title;  // Keep existing title if no new one is provided
//       post.description = description || post.description;  // Same for description
//       post.mediaUrl = mediaUrl || post.mediaUrl;  // Update media URL if provided
//       post.mediaType = mediaType || post.mediaType;  // Update media type if provided

//       // Save the updated post
//       await post.save();

//       // Respond with the updated blog post
//       res.status(200).json({ message: "Blog post updated successfully", updatedPost: post });
//     } catch (error) {
//       console.error('Error updating blog post:', error);
//       res.status(500).json({ error: "Error updating blog post" });
//     }
//   }
// );

// Delete blog post by ID
const deleteBlogPost: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract the post ID from the URL parameters
      const { id } = req.params;

      console.log('Looking for post with ID:', id);

      // Check if the post exists
      const post = await BlogPost.findById(id);

      if (!post) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }

      console.log('Post found:', post);

      // If media exists, delete it from Cloudinary
      if (post.mediaUrl) {
        const publicId = post.mediaUrl.split("/").pop()?.split(".")[0];
        console.log('Deleting media with publicId:', publicId);
        
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Delete the blog post from MongoDB
      await BlogPost.findByIdAndDelete(id);

      // Send a success response
      res.status(200).json({ message: "Blog post and media deleted successfully" });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ error: "Error deleting blog post" });
    }
  }
);


export {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  // updateBlogPost,
  deleteBlogPost,
};
