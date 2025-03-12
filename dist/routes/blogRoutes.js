"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/blogRoutes.ts
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controllers/blogController");
const multerConfig_1 = require("../config/multerConfig");
const router = express_1.default.Router();
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
router.delete("/:id", blogController_1.deleteBlogPostById);
// Search for blog posts
// router.get("/search", searchBlogPosts);
exports.default = router;
