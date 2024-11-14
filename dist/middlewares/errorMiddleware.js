"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Configure dotenv to load the .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const errorMiddleware = {};
errorMiddleware.notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl} is invalid`);
    res.status(404);
    next(error);
};
errorMiddleware.errorHandler = (err, req, res, next) => {
    // console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        code: statusCode,
        message: err.message,
        env: process.env.NODE_ENV,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
    next();
};
exports.default = errorMiddleware;
