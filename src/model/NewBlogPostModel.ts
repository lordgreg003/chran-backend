import mongoose, { Schema, Document } from "mongoose";

export interface MediaItem {
  url: string;
  type: string; // Either "image" or "video"
}

interface IBlogPost extends Document {
  title: string;
  description: string;
  media: MediaItem[];
  mediaType: string;
  createdAt: Date;
}

const BlogPostSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  media: [
    {
      url: { type: String },
      type: { type: String }, // Either "image" or "video"
    },
  ],
  mediaType: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const BlogPost = mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
