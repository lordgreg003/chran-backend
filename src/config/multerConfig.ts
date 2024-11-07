import multer from "multer";

const storage = multer.memoryStorage(); // Use memory storage
export const upload = multer({ storage });
