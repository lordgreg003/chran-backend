import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ArticlePost } from "../model/ArticleModel";

// Create a new article
export const createArticle = asyncHandler(async (req: Request, res: Response) => {
    const { article } = req.body;

    if (!article) {
        res.status(400);
        throw new Error("Article content is required.");
    }

    try {
        const newArticle = await ArticlePost.create({ article });
        res.status(200).json({
            message: "Article created successfully.",
            newArticle,
        });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to create the article. Please try again.");
    }
});

// Get all articles
export const getAllArticles = asyncHandler(async (req: Request, res: Response) => {
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
        const articles = await ArticlePost.find(searchQuery)
            .sort({ createdAt: sortOrder }) // Sort by creation date
            .skip((currentPage - 1) * pageSize) // Skip documents for pagination
            .limit(pageSize); // Limit the number of documents

        const totalArticles = await ArticlePost.countDocuments(searchQuery); // Total count for pagination

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
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch articles. Please try again.");
    }
});


// Get an article by ID
export const getArticleById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const article = await ArticlePost.findById(id);

        if (!article) {
            res.status(400);
            throw new Error("Article not found.");
        }

        res.status(200).json({
            message: "Article retrieved successfully.",
            article,
        });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch the article. Please try again.");
    }
});

// Update an article
export const updateArticle = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { article } = req.body;

    try {
        const existingArticle = await ArticlePost.findById(id);

        if (!existingArticle) {
            res.status(400);
            throw new Error("Article not found.");
        }

        existingArticle.article = article || existingArticle.article;
        existingArticle.updatedAt = new Date();

        const updatedArticle = await existingArticle.save();

        res.status(200).json({
            message: "Article updated successfully.",
            updatedArticle,
        });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to update the article. Please try again.");
    }
});

// Delete an article
export const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const article = await ArticlePost.findById(id);

        if (!article) {
            res.status(400);
            throw new Error("Article not found.");
        }

        await article.deleteOne();

        res.status(200).json({
            message: "Article deleted successfully.",
        });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to delete the article. Please try again.");
    }
});
