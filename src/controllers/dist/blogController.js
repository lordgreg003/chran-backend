"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.deleteBlogPostById = exports.getBlogPostBySlug = exports.getAllBlogPosts = exports.createBlogPost = void 0;
var express_async_handler_1 = require("express-async-handler");
var BlogPost_1 = require("../model/BlogPost");
var cloudinary_1 = require("../config/cloudinary");
var stream = require("stream");
var slugify_1 = require("slugify");
// Function to generate a unique slug
var createUniqueSlug = function (title) { return __awaiter(void 0, void 0, Promise, function () {
    var baseSlug, slug, randomNumber;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                baseSlug = slugify_1["default"](title, { lower: true, strict: true });
                slug = baseSlug;
                _a.label = 1;
            case 1: return [4 /*yield*/, BlogPost_1.BlogPost.findOne({ slug: slug })];
            case 2:
                if (!_a.sent()) return [3 /*break*/, 3];
                randomNumber = Math.floor(Math.random() * 1000000) + 1;
                slug = baseSlug + "-" + randomNumber;
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, slug];
        }
    });
}); };
var createBlogPost = express_async_handler_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, author, status, tags, trimmedStatus, slug, images, files, _loop_1, i, existingPost, newPost, savedPost, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                _a = req.body, title = _a.title, description = _a.description, author = _a.author, status = _a.status, tags = _a.tags;
                trimmedStatus = status === null || status === void 0 ? void 0 : status.trim().toLowerCase();
                if (!["draft", "published"].includes(trimmedStatus)) {
                    throw new Error("Invalid status value: \"" + status + "\". Must be either \"draft\" or \"published\".");
                }
                console.log("Received title:", title);
                console.log("Received description:", description);
                console.log("Received author:", author);
                console.log("Received status:", status);
                console.log("Received tags:", tags);
                return [4 /*yield*/, createUniqueSlug(title)];
            case 1:
                slug = _b.sent();
                console.log("Generated unique slug:", slug);
                images = {
                    image1: "",
                    image2: "",
                    image3: "",
                    image4: "",
                    image5: ""
                };
                files = req.files;
                if (!files) return [3 /*break*/, 6];
                _loop_1 = function (i) {
                    var fieldName, file_1, uploadResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                fieldName = "image" + i;
                                if (!(files[fieldName] && files[fieldName][0])) return [3 /*break*/, 2];
                                file_1 = files[fieldName][0];
                                return [4 /*yield*/, new Promise(function (resolve, reject) {
                                        var uploadStream = cloudinary_1["default"].uploader.upload_stream({
                                            resource_type: "auto",
                                            folder: "blog_posts",
                                            transformation: file_1.mimetype.startsWith("image")
                                                ? [
                                                    {
                                                        width: 300,
                                                        height: 300,
                                                        crop: "limit",
                                                        quality: "auto:best"
                                                    },
                                                ]
                                                : undefined
                                        }, function (error, result) {
                                            if (error) {
                                                console.error("Cloudinary upload error:", error);
                                                return reject(new Error("Failed to upload to Cloudinary"));
                                            }
                                            if (result) {
                                                resolve({
                                                    url: result.secure_url,
                                                    type: result.resource_type
                                                });
                                            }
                                        });
                                        var bufferStream = new stream.PassThrough();
                                        bufferStream.end(file_1.buffer);
                                        bufferStream.pipe(uploadStream);
                                    })];
                            case 1:
                                uploadResult = _a.sent();
                                images[fieldName] = uploadResult.url;
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                };
                i = 1;
                _b.label = 2;
            case 2:
                if (!(i <= 5)) return [3 /*break*/, 5];
                return [5 /*yield**/, _loop_1(i)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 7];
            case 6:
                console.log("No files uploaded.");
                _b.label = 7;
            case 7: return [4 /*yield*/, BlogPost_1.BlogPost.findOne({ slug: slug })];
            case 8:
                existingPost = _b.sent();
                if (existingPost) {
                    throw new Error("A blog post with the slug \"" + slug + "\" already exists.");
                }
                newPost = new BlogPost_1.BlogPost(__assign({ title: title,
                    description: description,
                    slug: slug,
                    author: author, status: trimmedStatus, tags: tags }, images));
                return [4 /*yield*/, newPost.save()];
            case 9:
                savedPost = _b.sent();
                res.status(200).json(savedPost);
                return [2 /*return*/];
            case 10:
                error_1 = _b.sent();
                console.error("Error creating blog post:", error_1);
                next(error_1);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
exports.createBlogPost = createBlogPost;
var deleteBlogPostById = express_async_handler_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, blogPost, _i, _a, mediaItem, publicId, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                id = req.params.id;
                return [4 /*yield*/, BlogPost_1.BlogPost.findById(id)];
            case 1:
                blogPost = _b.sent();
                if (!blogPost) {
                    res.status(404).json({ error: "Blog post not found" });
                    return [2 /*return*/]; // Exit after sending a response
                }
                if (!(blogPost.media && Array.isArray(blogPost.media))) return [3 /*break*/, 5];
                _i = 0, _a = blogPost.media;
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                mediaItem = _a[_i];
                publicId = mediaItem.url.split("/").slice(-1)[0].split(".")[0];
                return [4 /*yield*/, cloudinary_1["default"].uploader.destroy(publicId, {
                        resource_type: mediaItem.type
                    })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [4 /*yield*/, BlogPost_1.BlogPost.deleteOne({ _id: blogPost._id })];
            case 6:
                _b.sent();
                res.status(200).json({ message: "Blog post deleted successfully" });
                return [3 /*break*/, 8];
            case 7:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
exports.deleteBlogPostById = deleteBlogPostById;
// Get all blog posts with pagination
var getAllBlogPosts = express_async_handler_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, skip, blogPosts, total, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                page = parseInt(req.query.page) || 1;
                limit = parseInt(req.query.limit) || 10;
                skip = (page - 1) * limit;
                return [4 /*yield*/, BlogPost_1.BlogPost.find().skip(skip).limit(limit)];
            case 1:
                blogPosts = _a.sent();
                return [4 /*yield*/, BlogPost_1.BlogPost.countDocuments()];
            case 2:
                total = _a.sent();
                res.status(200).json({
                    blogPosts: blogPosts,
                    total: total,
                    page: page,
                    pages: Math.ceil(total / limit)
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Error creating blog post:", error_3);
                next(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.getAllBlogPosts = getAllBlogPosts;
// Get a blog post by slug
var getBlogPostBySlug = express_async_handler_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var slug, blogPost, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                slug = req.params.slug;
                return [4 /*yield*/, BlogPost_1.BlogPost.findOne({ slug: slug })];
            case 1:
                blogPost = _a.sent();
                if (!blogPost) {
                    res.status(404).json({ message: "Blog post not found" });
                    return [2 /*return*/];
                }
                res.status(200).json(blogPost);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error("Error creating blog post:", error_4);
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.getBlogPostBySlug = getBlogPostBySlug;
