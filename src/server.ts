import express, { Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db";
import blogRoutes from "./routes/blogRoutes";
import authRoutes from "./routes/adminRoutes";
import errorMiddleware from "./middlewares/errorMiddleware";
 
connectDB();

// Create Express app
const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());



// Use blog routes
app.use("/api/blogs", blogRoutes);
app.use("/admin/", authRoutes);

app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);
 

const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
