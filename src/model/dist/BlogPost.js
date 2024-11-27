"use strict";
exports.__esModule = true;
exports.BlogPost = void 0;
var mongoose_1 = require("mongoose");
var BlogPostSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    media: [
        {
            url: { type: String },
            type: { type: String }
        },
    ],
    slug: { type: String, unique: true, required: true },
    fullUrl: { type: String, unique: true, required: true },
    mediaType: { type: String },
    createdAt: { type: Date, "default": Date.now }
});
exports.BlogPost = mongoose_1["default"].model("BlogPost", BlogPostSchema);
