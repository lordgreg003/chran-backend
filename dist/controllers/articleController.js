"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.getAllArticles = exports.createArticle = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ArticleModel_1 = require("../model/ArticleModel");
// Create a new article
exports.createArticle = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { article } = req.body;
    if (!article) {
        res.status(400);
        throw new Error("Article content is required.");
    }
    try {
        const newArticle = yield ArticleModel_1.ArticlePost.create({ article });
        res.status(200).json({
            message: "Article created successfully.",
            newArticle,
        });
    }
    catch (error) {
        res.status(500);
        throw new Error("Failed to create the article. Please try again.");
    }
}));
// Get all articles
exports.getAllArticles = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search = "", sort = "desc" } = req.query;
        // Convert query parameters to proper types
        const currentPage = Number(page) || 1;
        const pageSize = Number(limit) || 10;
        const sortOrder = sort === "asc" ? 1 : -1;
        // Build the search query
        const searchQuery = search
            ? { article: { $regex: search, $options: "i" } } // Case-insensitive search
            : {};
        // Fetch articles with pagination, search, and sorting
        const articles = yield ArticleModel_1.ArticlePost.find(searchQuery)
            .sort({ createdAt: sortOrder }) // Sort by creation date
            .skip((currentPage - 1) * pageSize) // Skip documents for pagination
            .limit(pageSize); // Limit the number of documents
        const totalArticles = yield ArticleModel_1.ArticlePost.countDocuments(searchQuery); // Total count for pagination
        if (articles.length === 0) {
            res.status(404);
            throw new Error("No articles found.");
        }
        res.status(200).json({
            message: "Articles retrieved successfully.",
            articles,
            currentPage,
            totalPages: Math.ceil(totalArticles / pageSize),
            totalArticles,
        });
    }
    catch (error) {
        res.status(500);
        throw new Error("Failed to fetch articles. Please try again.");
    }
}));
// Get an article by ID
exports.getArticleById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const article = yield ArticleModel_1.ArticlePost.findById(id);
        if (!article) {
            res.status(400);
            throw new Error("Article not found.");
        }
        res.status(200).json({
            message: "Article retrieved successfully.",
            article,
        });
    }
    catch (error) {
        res.status(500);
        throw new Error("Failed to fetch the article. Please try again.");
    }
}));
// Update an article
exports.updateArticle = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { article } = req.body;
    try {
        const existingArticle = yield ArticleModel_1.ArticlePost.findById(id);
        if (!existingArticle) {
            res.status(400);
            throw new Error("Article not found.");
        }
        existingArticle.article = article || existingArticle.article;
        existingArticle.updatedAt = new Date();
        const updatedArticle = yield existingArticle.save();
        res.status(200).json({
            message: "Article updated successfully.",
            updatedArticle,
        });
    }
    catch (error) {
        res.status(500);
        throw new Error("Failed to update the article. Please try again.");
    }
}));
// Delete an article
exports.deleteArticle = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const article = yield ArticleModel_1.ArticlePost.findById(id);
        if (!article) {
            res.status(400);
            throw new Error("Article not found.");
        }
        yield article.deleteOne();
        res.status(200).json({
            message: "Article deleted successfully.",
        });
    }
    catch (error) {
        res.status(500);
        throw new Error("Failed to delete the article. Please try again.");
    }
}));
