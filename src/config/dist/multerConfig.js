"use strict";
exports.__esModule = true;
exports.upload = void 0;
var multer_1 = require("multer");
var storage = multer_1["default"].memoryStorage();
exports.upload = multer_1["default"]({
    storage: storage,
    limits: {
        fileSize: 2000 * 1024 * 1024
    },
    fileFilter: function (_req, file, cb) {
        console.log("File MIME type:", file.mimetype);
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
            cb(error, false);
        }
    }
});
exports["default"] = exports.upload;
