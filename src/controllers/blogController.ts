import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { BlogPost, MediaItem } from "../model/BlogPost";
import cloudinary from "../config/cloudinary";
import * as stream from "stream";
import slugify from "slugify";

// Define the type for the images object
interface Images {
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
}

// Function to generate a unique slug
const createUniqueSlug = async (title: string): Promise<string> => {
  let baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;

  while (await BlogPost.findOne({ slug })) {
    const randomNumber = Math.floor(Math.random() * 1000000) + 1;
    slug = `${baseSlug}-${randomNumber}`;
  }

  return slug;
};

const createBlogPost: RequestHandler = asyncHandler(async (req, res, next) => {
  try {
    const { title, description, author, status, tags } = req.body;

    const trimmedStatus = status?.trim().toLowerCase();
    if (!["draft", "published"].includes(trimmedStatus)) {
      throw new Error(`Invalid status value: "${status}". Must be either "draft" or "published".`);
    }

     const slug = await createUniqueSlug(title);
    console.log("Generated unique slug:", slug);

    const images: Images = {
      image1: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
    };

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files) {
      for (let i = 1; i <= 5; i++) {
        const fieldName = `image${i}`;
        if (files[fieldName] && files[fieldName][0]) {
          const file = files[fieldName][0];

          const uploadResult = await new Promise<{ url: string; type: string }>(
            (resolve, reject) => {
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

          images[fieldName as keyof Images] = uploadResult.url;
        }
      }
    } else {
      console.log("No files uploaded.");
    }

    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      throw new Error(`A blog post with the slug "${slug}" already exists.`);
    }

    const newPost = new BlogPost({
      title,
      description,
      slug,
      author,
      status: trimmedStatus,
      tags,
      ...images,
    });

    const savedPost = await newPost.save();

    res.status(200).json(savedPost);
    return;
  } catch (error) {
    console.error("Error creating blog post:", error);
    next(error);
  }
});

const updateBlogPostBySlug: RequestHandler = asyncHandler(async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { title, description, updatedMedia } = req.body;

    // Find blog post by slug
    const blogPost = await BlogPost.findOne({ slug });
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

const deleteBlogPostById: RequestHandler = asyncHandler(async (req, res, next) => {
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

// Get all blog posts with pagination
const getAllBlogPosts: RequestHandler = asyncHandler(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const blogPosts = await BlogPost.find().skip(skip).limit(limit);
    const total = await BlogPost.countDocuments();

    res.status(200).json({
      blogPosts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    next(error);
  }
});

// Get a blog post by slug
const getBlogPostBySlug: RequestHandler = asyncHandler(
  async (req, res, next) => {
    try {
      const { slug } = req.params;

      // Fetch the blog post by slug
      const blogPost = await BlogPost.findOne({ slug });

      if (!blogPost) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }

      res.status(200).json(blogPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      next(error);
    }
  }
);
 
export {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,  
  deleteBlogPostById,
  updateBlogPostBySlug,
};
