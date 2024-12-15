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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.deleteBlogPost = exports.updateBlogPost = exports.getBlogPostById = exports.getAllBlogPosts = exports.createBlogPost = void 0;
var express_async_handler_1 = require("express-async-handler");
var BlogPost_1 = require("../model/BlogPost");
var cloudinary_1 = require("../config/cloudinary");
var stream = require("stream");
var createBlogPost = express_async_handler_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, media, _loop_1, _i, _b, file, newPost, savedPost, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 8, , 9]);
                _a = req.body, title = _a.title, description = _a.description;
                console.log("Received title:", title);
                console.log("Received description:", description);
                media = [];
                if (!(req.files && Array.isArray(req.files))) return [3 /*break*/, 5];
                _loop_1 = function (file) {
                    var uploadResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("Processing file:", file.originalname);
                                console.log("File MIME type:", file.mimetype);
                                return [4 /*yield*/, new Promise(function (resolve, reject) {
                                        var uploadStream = cloudinary_1["default"].uploader.upload_stream({
                                            resource_type: "auto",
                                            folder: "blog_posts",
                                            transformation: file.mimetype.startsWith("image")
                                                ? [
                                                    {
                                                        width: 300,
                                                        height: 300,
                                                        crop: "limit",
                                                        quality: "auto:best"
                                                    },
                                                ]
                                                : undefined,
                                            timeout: 60000
                                        }, function (error, result) {
                                            if (error) {
                                                console.error("Cloudinary upload error:", error);
                                                return reject(new Error("Failed to upload to Cloudinary"));
                                            }
                                            if (result) {
                                                console.log("Cloudinary upload successful, result:", result);
                                                resolve({
                                                    url: result.secure_url,
                                                    type: result.resource_type
                                                });
                                            }
                                        });
                                        var bufferStream = new stream.PassThrough();
                                        bufferStream.end(file.buffer);
                                        bufferStream.pipe(uploadStream);
                                    })];
                            case 1:
                                uploadResult = _a.sent();
                                // Add the uploaded media info to the media array
                                media.push(uploadResult);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _b = req.files;
                _c.label = 1;
            case 1:
                if (!(_i < _b.length)) return [3 /*break*/, 4];
                file = _b[_i];
                return [5 /*yield**/, _loop_1(file)];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 6];
            case 5:
                console.log("No files uploaded or files array is not an array.");
                _c.label = 6;
            case 6:
                newPost = new BlogPost_1.BlogPost({
                    title: title,
                    description: description,
                    media: media
                });
                return [4 /*yield*/, newPost.save()];
            case 7:
                savedPost = _c.sent();
                // const webhookUrl =
                //   "https://hook.eu2.make.com/23gt24xaj83x26hf1odsxl92lrji6mrk";
                // // Send data to the webhook
                // await axios.post(webhookUrl, {
                //   title,
                //   description,
                //   media,
                // });
                // Respond with the created blog post
                res.status(201).json(savedPost);
                return [3 /*break*/, 9];
            case 8:
                error_1 = _c.sent();
                console.error("Error creating blog post:", error_1);
                res.status(500).json({ error: "Error creating blog post" });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
exports.createBlogPost = createBlogPost;
// Get all blog posts
var getAllBlogPosts = express_async_handler_1["default"](function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var search, page, limit, skip, query, _a, blogPosts, total, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                search = req.query.search
                    ? new RegExp(req.query.search, "i")
                    : null;
                page = parseInt(req.query.page, 10) || 1;
                limit = parseInt(req.query.limit, 10) || 10;
                skip = (page - 1) * limit;
                query = search ? { title: { $regex: search } } : {};
                return [4 /*yield*/, Promise.all([
                        BlogPost_1.BlogPost.find(query).skip(skip).limit(limit),
                        BlogPost_1.BlogPost.countDocuments(query),
                    ])];
            case 1:
                _a = _b.sent(), blogPosts = _a[0], total = _a[1];
                res.status(200).json({
                    blogPosts: blogPosts,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(total / limit),
                        totalItems: total
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error("Error fetching blog posts:", error_2);
                res.status(500).json({ message: "Error fetching blog posts" });
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
                    res.status(404).json({ message: "Blog post not found" });
                    return [2 /*return*/];
                }
                res.status(200).json(blogPost);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
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
var updateBlogPost = express_async_handler_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, title, description, updatedMedia_1, blogPost, currentMedia, newMedia, _loop_2, _i, _b, file, _c, currentMedia_1, mediaItem, publicId, updatedPost, error_4;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 11, , 12]);
                id = req.params.id;
                _a = req.body, title = _a.title, description = _a.description, updatedMedia_1 = _a.updatedMedia;
                return [4 /*yield*/, BlogPost_1.BlogPost.findById(id)];
            case 1:
                blogPost = _d.sent();
                if (!blogPost) {
                    res.status(404).json({ error: "Blog post not found" });
                    return [2 /*return*/];
                }
                currentMedia = blogPost.media || [];
                newMedia = [];
                if (!(req.files && Array.isArray(req.files))) return [3 /*break*/, 5];
                _loop_2 = function (file) {
                    var uploadResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    var uploadStream = cloudinary_1["default"].uploader.upload_stream({
                                        resource_type: "auto",
                                        folder: "blog_posts"
                                    }, function (error, result) {
                                        if (error)
                                            return reject(error);
                                        if (result)
                                            resolve({
                                                url: result.secure_url,
                                                type: result.resource_type
                                            });
                                    });
                                    var bufferStream = new stream.PassThrough();
                                    bufferStream.end(file.buffer);
                                    bufferStream.pipe(uploadStream);
                                })];
                            case 1:
                                uploadResult = _a.sent();
                                newMedia.push(uploadResult);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _b = req.files;
                _d.label = 2;
            case 2:
                if (!(_i < _b.length)) return [3 /*break*/, 5];
                file = _b[_i];
                return [5 /*yield**/, _loop_2(file)];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                _c = 0, currentMedia_1 = currentMedia;
                _d.label = 6;
            case 6:
                if (!(_c < currentMedia_1.length)) return [3 /*break*/, 9];
                mediaItem = currentMedia_1[_c];
                if (!!(updatedMedia_1 === null || updatedMedia_1 === void 0 ? void 0 : updatedMedia_1.includes(mediaItem.url))) return [3 /*break*/, 8];
                publicId = mediaItem.url.split("/").slice(-1)[0].split(".")[0];
                return [4 /*yield*/, cloudinary_1["default"].uploader.destroy(publicId, {
                        resource_type: mediaItem.type
                    })];
            case 7:
                _d.sent();
                _d.label = 8;
            case 8:
                _c++;
                return [3 /*break*/, 6];
            case 9:
                // Update blog post
                blogPost.title = title || blogPost.title;
                blogPost.description = description || blogPost.description;
                blogPost.media = __spreadArrays(newMedia, currentMedia.filter(function (media) { return updatedMedia_1 === null || updatedMedia_1 === void 0 ? void 0 : updatedMedia_1.includes(media.url); }));
                return [4 /*yield*/, blogPost.save()];
            case 10:
                updatedPost = _d.sent();
                res.status(200).json({
                    message: "Blog post updated successfully",
                    updatedPost: updatedPost
                });
                return [3 /*break*/, 12];
            case 11:
                error_4 = _d.sent();
                next(error_4);
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
exports.updateBlogPost = updateBlogPost;
// Delete blog post by ID
var deleteBlogPost = express_async_handler_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, blogPost, _i, _a, mediaItem, publicId, error_5;
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
                error_5 = _b.sent();
                next(error_5);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
exports.deleteBlogPost = deleteBlogPost;
