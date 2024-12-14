"use strict";
exports.__esModule = true;
var express_1 = require("express");
var dotenv = require("dotenv");
dotenv.config();
var path_1 = require("path");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var blogRoutes_1 = require("./routes/blogRoutes");
var adminRoutes_1 = require("./routes/adminRoutes");
var articleRoutes_1 = require("./routes/articleRoutes");
var errorMiddleware_1 = require("./middlewares/errorMiddleware");
var connectDB_1 = require("./config/connectDB");
// Connect to the database
connectDB_1["default"]();
// Create Express app
var app = express_1["default"]();
app.use(express_1["default"].json());
app.use(cors_1["default"]());
app.use(body_parser_1["default"].json());
app.set("view engine", "ejs");
app.set("views", path_1["default"].join(__dirname, "views"));
// Use blog routes
app.get("/", function (req, res) {
    var title = "My Awesome Blog Post"; // Replace with actual title from database
    var description = "This is a detailed description of the blog post."; // Replace with actual description
    var imageUrl = "https://example.com/image.jpg"; // Replace with actual image URL
    var fullUrl = "https://example.com/blog/" + req.params.slug;
    res.render("blogPost", {
        title: title,
        description: description,
        imageUrl: imageUrl,
        fullUrl: fullUrl
    });
});
app.use("/api/blogs", blogRoutes_1["default"]);
app.use("/api/article", articleRoutes_1["default"]);
app.use("/admin/", adminRoutes_1["default"]);
// Error handling middleware
app.use(errorMiddleware_1["default"].notFound);
app.use(errorMiddleware_1["default"].errorHandler);
// Set up the port for deployment
var PORT = Number(process.env.PORT) || 3001;
// Start the server
app.listen(PORT, "0.0.0.0", function () {
    console.log("Server is running on http://0.0.0.0:" + PORT);
});
