"use strict";
exports.__esModule = true;
exports.upload = void 0;
var multer_1 = require("multer");
var storage = multer_1["default"].memoryStorage(); // Use memory storage
exports.upload = multer_1["default"]({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
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
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            var error = new Error("Invalid file type. Only images and videos are allowed.");
            cb(error, false); // Explicitly cast the error for TypeScript
        }
    }
});
