import express, { Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import blogRoutes from "./routes/blogRoutes";

connectDB();

// Create Express app
const app: Application = express();
app.use(express.json());

// Use blog routes
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
