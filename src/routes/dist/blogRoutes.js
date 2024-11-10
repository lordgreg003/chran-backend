"use strict";
exports.__esModule = true;
// routes/blogRoutes.ts
var express_1 = require("express");
var blogController_1 = require("../controllers/blogController");
var multerConfig_1 = require("../config/multerConfig");
var router = express_1["default"].Router();
// Routes for blog posts
router.post("/", multerConfig_1.upload.single("media"), blogController_1.createBlogPost); // Admin: Create a new blog post
// Route to get all blog posts
router.get("/", blogController_1.getAllBlogPosts);
router.get("/:id", blogController_1.getBlogPostById);
router.put("/:id", multerConfig_1.upload.single('media'), blogController_1.updateBlogPost);
// Route to delete a blog post by ID
router["delete"]("/:id", blogController_1.deleteBlogPost);
// Search for blog posts
// router.get("/search", searchBlogPosts);
exports["default"] = router;
