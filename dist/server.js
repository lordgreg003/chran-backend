"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
// import newBlogRoute from "./routes/newBlogRoute";
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const articleRoutes_1 = __importDefault(require("./routes/articleRoutes"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const connectDB_1 = __importDefault(require("./config/connectDB"));
(0, connectDB_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
// Use blog routes
app.get("/", (req, res) => {
    const title = "My Awesome Blog Post"; // 
    const description = "This is a detailed description of the blog post.";
    const imageUrl = "https://example.com/image.jpg";
    const fullUrl = `https://example.com/blog/${req.params.slug}`;
    res.render("blogPost", {
        title,
        description,
        imageUrl,
        fullUrl,
    });
});
app.use("/api/blogs", blogRoutes_1.default);
// app.use("/api/newblog",newBlogRoute)
app.use("/api/article", articleRoutes_1.default);
app.use("/admin/", adminRoutes_1.default);
app.use(errorMiddleware_1.default.notFound);
app.use(errorMiddleware_1.default.errorHandler);
const PORT = Number(process.env.PORT) || 3001;
// Start the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
