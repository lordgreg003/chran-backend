import mongoose, { Schema, Document } from "mongoose";


interface Article extends Document {
    article : string ;
    createdAt: Date;
    updatedAt : Date;
  }

  const ArticleSchema : Schema = new Schema({
    article: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },})

  export const ArticlePost = mongoose.model<Article>("ArticlePost", ArticleSchema);