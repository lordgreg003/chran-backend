"use strict";
exports.__esModule = true;
exports.BlogPost = void 0;
var mongoose_1 = require("mongoose");
var slugify_1 = require("slugify");
var BlogPostSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },
    image5: { type: String },
    createdAt: { type: Date, "default": Date.now },
    slug: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    status: { type: String, "enum": ["draft", "published"], "default": "draft" },
    tags: { type: [String], "default": [] }
});
BlogPostSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = slugify_1["default"](this.title, { lower: true, strict: true });
    }
    next();
});
exports.BlogPost = mongoose_1["default"].model("BlogPost", BlogPostSchema);
