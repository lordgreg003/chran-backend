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
    mediaType: { type: String },
    createdAt: { type: Date, "default": Date.now }
});
exports.BlogPost = mongoose_1["default"].model("BlogPost", BlogPostSchema);
