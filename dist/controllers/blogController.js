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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteBlogPost = exports.updateBlogPost = exports.getBlogPostById = exports.getAllBlogPosts = exports.createBlogPost = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const BlogPost_1 = require("../model/BlogPost");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const stream = __importStar(require("stream"));
const fs_1 = __importDefault(require("fs"));
const handbrake_js_1 = __importDefault(require("handbrake-js")); // Import HandBrake-js
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
// Function to save buffer to a temp file
const saveBufferToTempFile = (buffer, extension) => {
    const tempFilePath = path_1.default.join(os_1.default.tmpdir(), `${Date.now()}.${extension}`);
    fs_1.default.writeFileSync(tempFilePath, buffer);
    return tempFilePath;
};
// Function to compress video
const compressVideo = (inputPath, outputPath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        handbrake_js_1.default.spawn({
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
});
// Retry logic for uploading to Cloudinary
const retryUpload = (buffer_1, ...args_1) => __awaiter(void 0, [buffer_1, ...args_1], void 0, function* (buffer, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return yield new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({
                    resource_type: "video",
                    folder: "blog_posts",
                    timeout: 120000,
                }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    if (result && result.secure_url && result.resource_type) {
                        resolve({ url: result.secure_url, type: result.resource_type });
                    }
                    else {
                        reject(new Error("Invalid Cloudinary response"));
                    }
                });
                const bufferStream = new stream.PassThrough();
                bufferStream.end(buffer);
                bufferStream.pipe(uploadStream);
            });
        }
        catch (error) {
            console.error(`Upload attempt ${i + 1} failed:`, error);
        }
    }
    throw new Error("Failed to upload to Cloudinary after retries");
});
const createBlogPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        console.log("Received title:", title);
        console.log("Received description:", description);
        const media = [];
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
                    let tempOutputFilePath = path_1.default.join(os_1.default.tmpdir(), `${Date.now()}_compressed.mp4`);
                    // Start compression (no size target if it's below 100MB)
                    yield compressVideo(tempInputFilePath, tempOutputFilePath);
                    // Read the compressed video file
                    const compressedVideoBuffer = fs_1.default.readFileSync(tempOutputFilePath);
                    // Upload the compressed video to Cloudinary
                    const uploadResult = yield retryUpload(compressedVideoBuffer);
                    media.push(uploadResult);
                    // Clean up temporary files
                    fs_1.default.unlinkSync(tempInputFilePath);
                    fs_1.default.unlinkSync(tempOutputFilePath);
                }
                else {
                    // Handle non-video files (e.g., images)
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
                            if (result && result.secure_url && result.resource_type) {
                                console.log("Cloudinary upload successful, result:", result);
                                resolve({
                                    url: result.secure_url,
                                    type: result.resource_type,
                                });
                            }
                            else {
                                reject(new Error("Invalid Cloudinary response"));
                            }
                        });
                        const bufferStream = new stream.PassThrough();
                        bufferStream.end(file.buffer);
                        bufferStream.pipe(uploadStream);
                    });
                    media.push(uploadResult);
                }
            }
        }
        else {
            console.log("No files uploaded or files array is not an array.");
        }
        // Create a new blog post
        const newPost = new BlogPost_1.BlogPost({
            title,
            description,
            media,
        });
        // Save to MongoDB
        const savedPost = yield newPost.save();
        // Respond with the created blog post
        res.status(201).json(savedPost);
    }
    catch (error) {
        console.error("Error creating blog post:", error);
        res.status(500).json({ error: "Error creating blog post" });
    }
}));
exports.createBlogPost = createBlogPost;
// Get all blog posts
const getAllBlogPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = req.query.search
            ? new RegExp(req.query.search, "i")
            : null;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const query = search ? { title: { $regex: search } } : {};
        const [blogPosts, total] = yield Promise.all([
            BlogPost_1.BlogPost.find(query).skip(skip).limit(limit),
            BlogPost_1.BlogPost.countDocuments(query),
        ]);
        res.status(200).json({
            blogPosts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
            },
        });
    }
    catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).json({ message: "Error fetching blog posts" });
    }
}));
exports.getAllBlogPosts = getAllBlogPosts;
// Get a blog post by ID
const getBlogPostById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Extract the ID from the request parameters
    try {
        // Fetch the blog post by ID
        const blogPost = yield BlogPost_1.BlogPost.findById(id);
        if (!blogPost) {
            res.status(404).json({ message: "Blog post not found" });
            return;
        }
        res.status(200).json(blogPost);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching blog post", error: error.message });
    }
}));
exports.getBlogPostById = getBlogPostById;
// Update a blog post by ID
const updateBlogPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, updatedMedia } = req.body;
        // Find blog post by ID
        const blogPost = yield BlogPost_1.BlogPost.findById(id);
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
        // Update blog post
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
exports.updateBlogPost = updateBlogPost;
// Delete blog post by ID
const deleteBlogPost = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.deleteBlogPost = deleteBlogPost;
