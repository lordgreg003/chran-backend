"use strict";
// import mongoose, { Document, Schema } from "mongoose";
// type BlogStatus = "draft" | "published" | "archived";
// export interface IBlog extends Document {
//   title: string;
//   slug: string;
//   author: mongoose.Types.ObjectId;
//   content: string;
//   description: string;
//   category?: mongoose.Types.ObjectId;
//   tags?: mongoose.Types.ObjectId[];
//   created_at: Date;
//   updated_at: Date;
//   published_at?: Date;
//   status: BlogStatus;
//   featured_image?: string;
//   image1?: string;
//   image2?: string;
//   image3?: string;
//   image4?: string;
//   image5?: string;
//   image6?: string;
//   video?: string;
// }
// // Blog Schema
// const BlogSchema: Schema = new Schema<IBlog>({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   slug: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },
//   author: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   category: {
//     type: Schema.Types.ObjectId,
//     ref: "Category",
//   },
//   tags: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Tag",
//     },
//   ],
//   created_at: {
//     type: Date,
//     default: Date.now,
//   },
//   updated_at: {
//     type: Date,
//     default: Date.now,
//   },
//   published_at: {
//     type: Date,
//   },
//   status: {
//     type: String,
//     enum: ["draft", "published", "archived"],
//     default: "draft",
//   },
//   featured_image: {
//     type: String,
//   },
//   image1: {
//     type: String,
//   },
//   image2: {
//     type: String,
//   },
//   image3: {
//     type: String,
//   },
//   image4: {
//     type: String,
//   },
//   image5: {
//     type: String,
//   },
//   image6: {
//     type: String,
//   },
//   video: {
//     type: String,
//   },
// });
// export default mongoose.model<IBlog>("Blog", BlogSchema);
