import multer from "multer";
 
 const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 2000 * 1024 * 1024,  
  },
  fileFilter: (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    console.log("File MIME type:", file.mimetype);

    const allowedTypes = [
      "image/jpeg",  
      "image/png",  
      "image/gif",  
      "image/webp", 
      "image/bmp",  
      "image/tiff",  
      "image/svg+xml",  
      "video/mp4",  
      "video/quicktime", 
      "video/x-msvideo",  
      "video/webm", 
      "video/3gpp",  
      "video/ogg",  
      "video/mkv", 
    ];

     if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);  
    } else {
      const error = new Error(
        "Invalid file type. Only images and videos are allowed."
      );
      cb(error as any, false); 
    }
  },
});

export default upload;
