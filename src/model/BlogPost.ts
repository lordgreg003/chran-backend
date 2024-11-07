import mongoose, { Schema, Document } from "mongoose";

interface IBlogPost extends Document {
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: string; // Either "image" or "video"
  createdAt: Date;
}

const BlogPostSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mediaUrl: { type: String },
  mediaType: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const BlogPost = mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
