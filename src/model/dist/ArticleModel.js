"use strict";
exports.__esModule = true;
exports.ArticlePost = void 0;
var mongoose_1 = require("mongoose");
var ArticleSchema = new mongoose_1.Schema({
    article: { type: String, required: true },
    createdAt: { type: Date, "default": Date.now },
    updatedAt: { type: Date, "default": Date.now }
});
exports.ArticlePost = mongoose_1["default"].model("ArticlePost", ArticleSchema);
