import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import connectDB from "./config/db";
import blogRoutes from "./routes/blogRoutes";
import path from "path";
import authRoutes from "./routes/adminRoutes";

connectDB();

// Create Express app
const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Use blog routes
app.use("/api/blogs", blogRoutes);
app.use("/admin/", authRoutes);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
