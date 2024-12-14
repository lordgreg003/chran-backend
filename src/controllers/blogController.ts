
import { Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler";
import { BlogPost } from "../model/BlogPost";
import cloudinary from "../config/cloudinary";
import * as stream from "stream";
import fs from "fs";
import Handbrake from "handbrake-js"; // Import HandBrake-js
import path from "path";
import os from "os";

// Define MediaItem type
type MediaItem = { url: string; type: string };

// Function to save buffer to a temp file
const saveBufferToTempFile = (buffer: Buffer, extension: string): string => {
  const tempFilePath = path.join(os.tmpdir(), `${Date.now()}.${extension}`);
  fs.writeFileSync(tempFilePath, buffer);
  return tempFilePath;
};

// Function to compress video
const compressVideo = async (
  inputPath: string,
  outputPath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    Handbrake.spawn({
      input: inputPath,
      output: outputPath,
      preset: "Very Fast 1080p30",
      quality: 20,
      audio: "aac",
      width: 1280,
      rate: 30,
    })
      .on("progress", (progress) => {
        console.log(`Compression progress: ${progress.percentComplete.toFixed(2)}%`);
      })
      .on("error", reject)
      .on("end", resolve);
  });
};

// Retry logic for uploading to Cloudinary
const retryUpload = async (buffer: Buffer, retries = 3): Promise<MediaItem> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "blog_posts",
            timeout: 120000,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            if (result && result.secure_url && result.resource_type) {
              resolve({ url: result.secure_url, type: result.resource_type });
            } else {
              reject(new Error("Invalid Cloudinary response"));
            }
          }
        );
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);
        bufferStream.pipe(uploadStream);
      });
    } catch (error) {
      console.error(`Upload attempt ${i + 1} failed:`, error);
    }
  }
  throw new Error("Failed to upload to Cloudinary after retries");
};

const createBlogPost: RequestHandler = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log("Received title:", title);
    console.log("Received description:", description);

    const media: MediaItem[] = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        console.log("Processing file:", file.originalname);
        console.log("File MIME type:", file.mimetype);

        if (file.mimetype.startsWith("video")) {
          const tempInputFilePath = saveBufferToTempFile(file.buffer, "mp4");

          let compressionMessage = "Video above 100MB will start compressing.";
          let targetSize = 100 * 1024 * 1024; // Default target size for videos above 100MB (100MB in bytes)

          if (file.size < targetSize) {
            compressionMessage = "Video below 100MB, compressing.";
            targetSize = 0; // No target size for videos below 100MB
          }

          console.log(compressionMessage);

          let tempOutputFilePath = path.join(os.tmpdir(), `${Date.now()}_compressed.mp4`);

          // Start compression (no size target if it's below 100MB)
          await compressVideo(tempInputFilePath, tempOutputFilePath);

          // Read the compressed video file
          const compressedVideoBuffer = fs.readFileSync(tempOutputFilePath);
          
          // Upload the compressed video to Cloudinary
          const uploadResult = await retryUpload(compressedVideoBuffer);
          media.push(uploadResult);

          // Clean up temporary files
          fs.unlinkSync(tempInputFilePath);
          fs.unlinkSync(tempOutputFilePath);

        } else {
          // Handle non-video files (e.g., images)
          const uploadResult = await new Promise<MediaItem>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: "auto",
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
                  : undefined,
              },
              (error, result) => {
                if (error) {
                  console.error("Cloudinary upload error:", error);
                  return reject(new Error("Failed to upload to Cloudinary"));
                }
                if (result && result.secure_url && result.resource_type) {
                  console.log("Cloudinary upload successful, result:", result);
                  resolve({
                    url: result.secure_url,
                    type: result.resource_type,
                  });
                } else {
                  reject(new Error("Invalid Cloudinary response"));
                }
              }
            );

            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);
            bufferStream.pipe(uploadStream);
          });

          media.push(uploadResult);
        }
      }
    } else {
      console.log("No files uploaded or files array is not an array.");
    }

    // Create a new blog post
    const newPost = new BlogPost({
      title,
      description,
      media,
    });

    // Save to MongoDB
    const savedPost = await newPost.save();

    // Respond with the created blog post
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ error: "Error creating blog post" });
  }
});

// Get all blog posts
const getAllBlogPosts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const search = req.query.search
        ? new RegExp(req.query.search as string, "i")
        : null;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;

      const query = search ? { title: { $regex: search } } : {};

      const [blogPosts, total] = await Promise.all([
        BlogPost.find(query).skip(skip).limit(limit),
        BlogPost.countDocuments(query),
      ]);

      res.status(200).json({
        blogPosts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    } catch (error: any) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  }
);

// Get a blog post by ID
const getBlogPostById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Extract the ID from the request parameters

    try {
      // Fetch the blog post by ID
      const blogPost = await BlogPost.findById(id);

      if (!blogPost) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }

      res.status(200).json(blogPost);
    } catch (error: any) {
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
        const uploadResult = await new Promise<{ url: string; type: string }>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: "auto",
                folder: "blog_posts",
              },
              (error, result) => {
                if (error) return reject(error);
                if (result)
                  resolve({
                    url: result.secure_url,
                    type: result.resource_type,
                  });
              }
            );

            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);
            bufferStream.pipe(uploadStream);
          }
        );

        newMedia.push(uploadResult);
      }
    }

    // Remove unused media from Cloudinary
    for (const mediaItem of currentMedia) {
      if (!updatedMedia?.includes(mediaItem.url)) {
        const publicId = mediaItem.url.split("/").slice(-1)[0].split(".")[0];
        await cloudinary.uploader.destroy(publicId, {
          resource_type: mediaItem.type,
        });
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
