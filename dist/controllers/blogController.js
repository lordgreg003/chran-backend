"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogPostBySlug = exports.deleteBlogPostById = exports.getBlogPostBySlug = exports.getAllBlogPosts = exports.createBlogPost = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const BlogPost_1 = require("../model/BlogPost");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const stream = __importStar(require("stream"));
const slugify_1 = __importDefault(require("slugify"));
// Function to generate a unique slug
const createUniqueSlug = (title) => __awaiter(void 0, void 0, void 0, function* () {
    let baseSlug = (0, slugify_1.default)(title, { lower: true, strict: true });
    let slug = baseSlug;
    while (yield BlogPost_1.BlogPost.findOne({ slug })) {
        const randomNumber = Math.floor(Math.random() * 1000000) + 1;
        slug = `${baseSlug}-${randomNumber}`;
    }
    return slug;
});
const createBlogPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, author, status, tags } = req.body;
        const trimmedStatus = status === null || status === void 0 ? void 0 : status.trim().toLowerCase();
        if (!["draft", "published"].includes(trimmedStatus)) {
            throw new Error(`Invalid status value: "${status}". Must be either "draft" or "published".`);
        }
        const slug = yield createUniqueSlug(title);
        console.log("Generated unique slug:", slug);
        const images = {
            image1: "",
            image2: "",
            image3: "",
            image4: "",
            image5: "",
        };
        const files = req.files;
        if (files) {
            for (let i = 1; i <= 5; i++) {
                const fieldName = `image${i}`;
                if (files[fieldName] && files[fieldName][0]) {
                    const file = files[fieldName][0];
                    const uploadResult = yield new Promise((resolve, reject) => {
                        const uploadStream = cloudinary_1.default.uploader.upload_stream({
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
                        }, (error, result) => {
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
                        });
                        const bufferStream = new stream.PassThrough();
                        bufferStream.end(file.buffer);
                        bufferStream.pipe(uploadStream);
                    });
                    images[fieldName] = uploadResult.url;
                }
            }
        }
        else {
            console.log("No files uploaded.");
        }
        const existingPost = yield BlogPost_1.BlogPost.findOne({ slug });
        if (existingPost) {
            throw new Error(`A blog post with the slug "${slug}" already exists.`);
        }
        const newPost = new BlogPost_1.BlogPost(Object.assign({ title,
            description,
            slug,
            author, status: trimmedStatus, tags }, images));
        const savedPost = yield newPost.save();
        res.status(200).json(savedPost);
        return;
    }
    catch (error) {
        console.error("Error creating blog post:", error);
        next(error);
    }
}));
exports.createBlogPost = createBlogPost;
const updateBlogPostBySlug = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const { title, description, updatedMedia } = req.body;
        // Find blog post by slug
        const blogPost = yield BlogPost_1.BlogPost.findOne({ slug });
        if (!blogPost) {
            res.status(404).json({ error: "Blog post not found" });
            return;
        }
        // Handle media updates
        const currentMedia = blogPost.media || [];
        // Upload new media
        const newMedia = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                const uploadResult = yield new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_1.default.uploader.upload_stream({
                        resource_type: "auto",
                        folder: "blog_posts",
                    }, (error, result) => {
                        if (error)
                            return reject(error);
                        if (result)
                            resolve({
                                url: result.secure_url,
                                type: result.resource_type,
                            });
                    });
                    const bufferStream = new stream.PassThrough();
                    bufferStream.end(file.buffer);
                    bufferStream.pipe(uploadStream);
                });
                newMedia.push(uploadResult);
            }
        }
        // Remove unused media from Cloudinary
        for (const mediaItem of currentMedia) {
            if (!(updatedMedia === null || updatedMedia === void 0 ? void 0 : updatedMedia.includes(mediaItem.url))) {
                const publicId = mediaItem.url.split("/").slice(-1)[0].split(".")[0];
                yield cloudinary_1.default.uploader.destroy(publicId, {
                    resource_type: mediaItem.type,
                });
            }
        }
        blogPost.title = title || blogPost.title;
        blogPost.description = description || blogPost.description;
        blogPost.media = [
            ...newMedia,
            ...currentMedia.filter((media) => updatedMedia === null || updatedMedia === void 0 ? void 0 : updatedMedia.includes(media.url)),
        ];
        const updatedPost = yield blogPost.save();
        res.status(200).json({
            message: "Blog post updated successfully",
            updatedPost,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.updateBlogPostBySlug = updateBlogPostBySlug;
const deleteBlogPostById = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Fetch the blog post by ID
        const blogPost = yield BlogPost_1.BlogPost.findById(id);
        if (!blogPost) {
            res.status(404).json({ error: "Blog post not found" });
            return; // Exit after sending a response
        }
        // Delete associated media
        if (blogPost.media && Array.isArray(blogPost.media)) {
            for (const mediaItem of blogPost.media) {
                const publicId = mediaItem.url.split("/").slice(-1)[0].split(".")[0];
                yield cloudinary_1.default.uploader.destroy(publicId, {
                    resource_type: mediaItem.type,
                });
            }
        }
        yield BlogPost_1.BlogPost.deleteOne({ _id: blogPost._id });
        res.status(200).json({ message: "Blog post deleted successfully" });
    }
    catch (error) {
        next(error);
    }
}));
exports.deleteBlogPostById = deleteBlogPostById;
// Get all blog posts with pagination
const getAllBlogPosts = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const blogPosts = yield BlogPost_1.BlogPost.find().skip(skip).limit(limit);
        const total = yield BlogPost_1.BlogPost.countDocuments();
        res.status(200).json({
            blogPosts,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        console.error("Error creating blog post:", error);
        next(error);
    }
}));
exports.getAllBlogPosts = getAllBlogPosts;
// Get a blog post by slug
const getBlogPostBySlug = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        // Fetch the blog post by slug
        const blogPost = yield BlogPost_1.BlogPost.findOne({ slug });
        if (!blogPost) {
            res.status(404).json({ message: "Blog post not found" });
            return;
        }
        res.status(200).json(blogPost);
    }
    catch (error) {
        console.error("Error creating blog post:", error);
        next(error);
    }
}));
exports.getBlogPostBySlug = getBlogPostBySlug;
