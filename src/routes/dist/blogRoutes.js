"use strict";
exports.__esModule = true;
// routes/blogRoutes.ts
var express_1 = require("express");
var blogController_1 = require("../controllers/blogController");
var multerConfig_1 = require("../config/multerConfig");
var router = express_1["default"].Router();
router.post("/", multerConfig_1.upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
]), blogController_1.createBlogPost);
// Route to get all blog posts
router.get("/", blogController_1.getAllBlogPosts);
router.get("/:slug", blogController_1.getBlogPostBySlug);
// router.put("/:id", upload.array("media", 3),  updateBlogPost);
// // Route to delete a blog post by ID
router["delete"]("/:id", blogController_1.deleteBlogPostById);
// Search for blog posts
// router.get("/search", searchBlogPosts);
exports["default"] = router;
