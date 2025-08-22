import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  hearts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  // Device-based interactions for anonymous users
  deviceLikes: { type: [String], default: [] }, // Array of device IDs
  deviceDislikes: { type: [String], default: [] }, // Array of device IDs
  deviceHearts: { type: [String], default: [] }, // Array of device IDs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

articleSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Article =
  mongoose?.models?.Article || mongoose.model("Article", articleSchema);

export default Article;
