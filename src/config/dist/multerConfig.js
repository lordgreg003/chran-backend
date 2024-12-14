"use strict";
exports.__esModule = true;
exports.upload = void 0;
var multer_1 = require("multer");
// Use memory storage
var storage = multer_1["default"].memoryStorage();
exports.upload = multer_1["default"]({
    storage: storage,
    limits: {
        fileSize: 2000 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        console.log("File MIME type:", file.mimetype); // Log the MIME type for debugging
        var allowedTypes = [
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
        // Check for the file type against allowed MIME types
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        }
        else {
            var error = new Error("Invalid file type. Only images and videos are allowed.");
            cb(error, false); // Reject the file with an error
        }
    }
});
exports["default"] = exports.upload;
