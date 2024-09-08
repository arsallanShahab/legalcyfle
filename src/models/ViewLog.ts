import crypto from "crypto";
import mongoose from "mongoose";

// Define the ViewLog Schema
const viewLogSchema = new mongoose.Schema({
  articleId: {
    // type: //string or mongoose.Schema.Types.ObjectId,
    type: String,
    // ref: "Article",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Not required if logging by IP
  },
  ipHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    // 10 minutes is the minimum time between views
    expires: 60 * 10, // 10 minutes
  },
});

// Hash the IP address before saving
viewLogSchema.pre("save", function (next) {
  if (this.isModified("ipHash") || this.isNew) {
    this.ipHash = crypto.createHash("sha256").update(this.ipHash).digest("hex");
  }
  next();
});

// create index to delete expired documents
viewLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const ViewLog =
  mongoose.models.ViewLog || mongoose.model("ViewLog", viewLogSchema);

export default ViewLog;
