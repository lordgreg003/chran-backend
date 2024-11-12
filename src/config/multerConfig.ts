import multer from "multer";

const storage = multer.memoryStorage(); // Use memory storage

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Allow up to 100MB per file
  },
  fileFilter: (req, file, cb) => {
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

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(
        "Invalid file type. Only images and videos are allowed."
      );
      cb(error as any, false); // Explicitly cast the error for TypeScript
    }
  },
});
