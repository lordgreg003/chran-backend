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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.getAllArticles = exports.createArticle = void 0;
var express_async_handler_1 = require("express-async-handler");
var ArticleModel_1 = require("../model/ArticleModel");
// Create a new article
exports.createArticle = express_async_handler_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var article, newArticle, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                article = req.body.article;
                if (!article) {
                    res.status(400);
                    throw new Error("Article content is required.");
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ArticleModel_1.ArticlePost.create({ article: article })];
            case 2:
                newArticle = _a.sent();
                res.status(200).json({
                    message: "Article created successfully.",
                    newArticle: newArticle
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(500);
                throw new Error("Failed to create the article. Please try again.");
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get all articles
exports.getAllArticles = express_async_handler_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, _d, search, _e, sort, currentPage, pageSize, sortOrder, searchQuery, articles, totalArticles, error_2;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 3, , 4]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, _d = _a.search, search = _d === void 0 ? "" : _d, _e = _a.sort, sort = _e === void 0 ? "desc" : _e;
                currentPage = Number(page) || 1;
                pageSize = Number(limit) || 10;
                sortOrder = sort === "asc" ? 1 : -1;
                searchQuery = search
                    ? { article: { $regex: search, $options: "i" } } // Case-insensitive search
                    : {};
                return [4 /*yield*/, ArticleModel_1.ArticlePost.find(searchQuery)
                        .sort({ createdAt: sortOrder }) // Sort by creation date
                        .skip((currentPage - 1) * pageSize) // Skip documents for pagination
                        .limit(pageSize)];
            case 1:
                articles = _f.sent();
                return [4 /*yield*/, ArticleModel_1.ArticlePost.countDocuments(searchQuery)];
            case 2:
                totalArticles = _f.sent();
                if (articles.length === 0) {
                    res.status(404);
                    throw new Error("No articles found.");
                }
                res.status(200).json({
                    message: "Articles retrieved successfully.",
                    articles: articles,
                    currentPage: currentPage,
                    totalPages: Math.ceil(totalArticles / pageSize),
                    totalArticles: totalArticles
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _f.sent();
                res.status(500);
                throw new Error("Failed to fetch articles. Please try again.");
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get an article by ID
exports.getArticleById = express_async_handler_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, article, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ArticleModel_1.ArticlePost.findById(id)];
            case 2:
                article = _a.sent();
                if (!article) {
                    res.status(400);
                    throw new Error("Article not found.");
                }
                res.status(200).json({
                    message: "Article retrieved successfully.",
                    article: article
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500);
                throw new Error("Failed to fetch the article. Please try again.");
            case 4: return [2 /*return*/];
        }
    });
}); });
// Update an article
exports.updateArticle = express_async_handler_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, article, existingArticle, updatedArticle, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                article = req.body.article;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, ArticleModel_1.ArticlePost.findById(id)];
            case 2:
                existingArticle = _a.sent();
                if (!existingArticle) {
                    res.status(400);
                    throw new Error("Article not found.");
                }
                existingArticle.article = article || existingArticle.article;
                existingArticle.updatedAt = new Date();
                return [4 /*yield*/, existingArticle.save()];
            case 3:
                updatedArticle = _a.sent();
                res.status(200).json({
                    message: "Article updated successfully.",
                    updatedArticle: updatedArticle
                });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                res.status(500);
                throw new Error("Failed to update the article. Please try again.");
            case 5: return [2 /*return*/];
        }
    });
}); });
// Delete an article
exports.deleteArticle = express_async_handler_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, article, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, ArticleModel_1.ArticlePost.findById(id)];
            case 2:
                article = _a.sent();
                if (!article) {
                    res.status(400);
                    throw new Error("Article not found.");
                }
                return [4 /*yield*/, article.deleteOne()];
            case 3:
                _a.sent();
                res.status(200).json({
                    message: "Article deleted successfully."
                });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                res.status(500);
                throw new Error("Failed to delete the article. Please try again.");
            case 5: return [2 /*return*/];
        }
    });
}); });
