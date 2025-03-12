"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 2000 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
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
        }
        else {
            const error = new Error("Invalid file type. Only images and videos are allowed.");
            cb(error, false);
        }
    },
});
exports.default = exports.upload;
