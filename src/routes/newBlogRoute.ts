// import express, { Request, Response, Router } from "express";
// import multer from "multer";
// import { createBlogPost } from "../controllers/blogController";

// const router: Router = express.Router();

// // Configure multer for file uploads
// const upload = multer({ dest: "uploads/" });

// // Define the route for creating a blog post
// router.post(
//   "/",
//   upload.fields([
//     { name: "featured_image", maxCount: 1 },
//     { name: "image1", maxCount: 1 },
//     { name: "image2", maxCount: 1 },
//     { name: "image3", maxCount: 1 },
//     { name: "image4", maxCount: 1 },
//     { name: "image5", maxCount: 1 },
//     { name: "image6", maxCount: 1 },
//     { name: "video", maxCount: 1 },
//   ]),
//   createBlogPost
// );

// export default router;
