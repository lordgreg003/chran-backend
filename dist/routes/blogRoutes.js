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
// Routes for blog posts
router.post("/", multerConfig_1.upload.array("media", 3), blogController_1.createBlogPost);
// Route to get all blog posts
router.get("/", blogController_1.getAllBlogPosts);
router.get("/:id", blogController_1.getBlogPostById);
router.put("/:id", multerConfig_1.upload.array("media", 3), blogController_1.updateBlogPost);
// Route to delete a blog post by ID
router.delete("/:id", blogController_1.deleteBlogPost);
// Search for blog posts
// router.get("/search", searchBlogPosts);
exports.default = router;
