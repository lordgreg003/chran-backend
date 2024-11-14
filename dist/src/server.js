"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = __importDefault(require("./config/db"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
// Connect to the database
(0, db_1.default)();
// Create Express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Use blog routes
app.use("/api/blogs", blogRoutes_1.default);
app.use("/admin/", adminRoutes_1.default);
// Error handling middleware
app.use(errorMiddleware_1.default.notFound);
app.use(errorMiddleware_1.default.errorHandler);
// Set up the port for deployment
const PORT = Number(process.env.PORT) || 3001;
// Start the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
