"use strict";
exports.__esModule = true;
var cloudinary_1 = require("cloudinary");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var _a = process.env, CLOUDINARY_CLOUD_NAME = _a.CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY = _a.CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET = _a.CLOUDINARY_API_SECRET;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary configuration variables are missing from .env");
}
cloudinary_1.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});
exports["default"] = cloudinary_1.v2;
