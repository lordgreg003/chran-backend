import multer from "multer";
import path from "path";

// Use memory storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Allow up to 100MB per file
  },
  fileFilter: (req, file, cb) => {
    console.log('File MIME type:', file.mimetype); // Log the MIME type for debugging

    const allowedTypes = [
      "image/jpeg", // JPEG images
      "image/png", // PNG images
      "image/gif", // GIF images
      "image/webp", // WebP images
      "image/bmp", // BMP images
      "image/tiff", // TIFF images
      "image/svg+xml", // SVG images
      "video/mp4", // MP4 videos
      "video/quicktime", // MOV videos
      "video/x-msvideo", // AVI videos
      "video/webm", // WebM videos
      "video/3gpp", // 3GP videos
      "video/ogg", // Ogg videos
      "video/mkv", // MKV videos
    ];

    // Check for the file type against allowed MIME types
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      const error = new Error(
        "Invalid file type. Only images and videos are allowed."
      );
      cb(error as any, false); // Reject the file with an error
    }
  },
});

export default upload;
