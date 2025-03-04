import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface MediaItem {
  url: string;
  type: string;
}

export interface IBlogPost extends Document {
  title: string;
  description: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  image5: string;
  createdAt: Date;
  slug: string;
  author: string;
  status: "draft" | "published";
  tags: string[];  
  media?: MediaItem[];
}

const BlogPostSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image1: { type: String },
  image2: { type: String },
  image3: { type: String },
  image4: { type: String },
  image5: { type: String },
  createdAt: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  status: { type: String, enum: ["draft", "published"], default: "draft" }, 
  tags: { type: [String], default: [] }  
});

BlogPostSchema.pre<IBlogPost>("save", function(next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const BlogPost = mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);