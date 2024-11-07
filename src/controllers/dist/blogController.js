"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.updateBlogPost = exports.getBlogPostById = exports.getAllBlogPosts = exports.createBlogPost = void 0;
var express_async_handler_1 = require("express-async-handler");
var BlogPost_1 = require("../model/BlogPost");
var cloudinary_1 = require("../config/cloudinary");
var stream = require("stream");
var createBlogPost = express_async_handler_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, mediaUrl, mediaType, uploadToCloudinary, uploadResult, newPost, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, title = _a.title, description = _a.description;
                mediaUrl = "";
                mediaType = "";
                if (!req.file) return [3 /*break*/, 2];
                uploadToCloudinary = function () {
                    return new Promise(function (resolve, reject) {
                        var _a;
                        var uploadStream = cloudinary_1["default"].uploader.upload_stream({
                            resource_type: "auto",
                            folder: "blog_posts"
                        }, function (error, result) {
                            if (error) {
                                return reject(new Error("Error uploading file to Cloudinary"));
                            }
                            if (result) {
                                resolve({
                                    mediaUrl: result.secure_url,
                                    mediaType: result.resource_type
                                });
                            }
                        });
                        // Stream the file buffer to Cloudinary
                        var bufferStream = new stream.PassThrough();
                        bufferStream.end((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer); // Use optional chaining to handle undefined
                        bufferStream.pipe(uploadStream);
                    });
                };
                return [4 /*yield*/, uploadToCloudinary()];
            case 1:
                uploadResult = _b.sent();
                mediaUrl = uploadResult.mediaUrl;
                mediaType = uploadResult.mediaType;
                _b.label = 2;
            case 2:
                newPost = new BlogPost_1.BlogPost({
                    title: title,
                    description: description,
                    mediaUrl: mediaUrl,
                    mediaType: mediaType
                });
                // Save the new post to MongoDB
                return [4 /*yield*/, newPost.save()];
            case 3:
                // Save the new post to MongoDB
                _b.sent();
                // Respond with success
                res
                    .status(201)
                    .json({ message: "Blog post created successfully", newPost: newPost });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error(error_1);
                res.status(500).json({ error: "Error creating blog post" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.createBlogPost = createBlogPost;
// Get all blog posts
var getAllBlogPosts = express_async_handler_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var blogPosts, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, BlogPost_1.BlogPost.find().sort({ createdAt: -1 })];
            case 1:
                blogPosts = _a.sent();
                // Respond with the blog posts
                res
                    .status(200)
                    .json({ message: "Blog posts retrieved successfully", blogPosts: blogPosts });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error(error_2);
                res.status(500).json({ error: "Error fetching blog posts" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.getAllBlogPosts = getAllBlogPosts;
// Get a blog post by ID
var getBlogPostById = express_async_handler_1["default"](function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var id, blogPost, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, BlogPost_1.BlogPost.findById(id)];
            case 2:
                blogPost = _a.sent();
                if (!blogPost) {
                    res.status(404).json({ message: "Blog post not found" }); // If not found, return 404
                    return [2 /*return*/];
                }
                res.status(200).json(blogPost); // Send the blog post as a response
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Error fetching blog post:", error_3);
                res
                    .status(500)
                    .json({ message: "Error fetching blog post", error: error_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.getBlogPostById = getBlogPostById;
// Update a blog post by ID
var updateBlogPost = express_async_handler_1["default"](function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var id, _a, title, description, image, video, post, updatedPost;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, title = _a.title, description = _a.description, image = _a.image, video = _a.video;
                // Validate incoming data
                if (!title && !description && !image && !video) {
                    res.status(400).json({
                        message: "At least one field (title, description, image, video) must be provided to update."
                    });
                    return [2 /*return*/]; // Exit the function if no fields are provided
                }
                return [4 /*yield*/, BlogPost_1.BlogPost.findById(id)];
            case 1:
                post = _b.sent();
                if (!post) {
                    res.status(404).json({ message: "Blog post not found" });
                    return [2 /*return*/]; // Exit if the post doesn't exist
                }
                return [4 /*yield*/, post.save()];
            case 2:
                updatedPost = _b.sent();
                res.status(200).json(updatedPost); // Send response with updated blog post
                return [2 /*return*/];
        }
    });
}); });
exports.updateBlogPost = updateBlogPost;
