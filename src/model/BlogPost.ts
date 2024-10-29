import mongoose, { Document, Schema } from "mongoose";

// Define a TypeScript interface for the BlogPost model
interface IBlogPost extends Document {
  title: string;
  description: string;
  image?: string;
  video?: string;
  likes: number;
  createdAt: Date;
  vector: number[];
}

// Define the Mongoose schema
const BlogPostSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: null },
  video: { type: String, default: null },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  vector: { type: [Number], required: true }, 
});

// Export the model and interface
const BlogPost = mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
export { BlogPost, IBlogPost };
