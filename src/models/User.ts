import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { ObjectId } from "mongoose";
import { nanoid } from "nanoid";
import Article from "./Article";

// Define the User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
  },
  username: {
    type: String,
    required: false,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  likedArticles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  disLikedArticles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  hearts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

//set the user name before saving the user, check if the username is already taken and if it is, add a random number to the username
userSchema.pre("save", async function (next) {
  if (this.isModified("username") || this.isNew) {
    const user = await (this.constructor as typeof User).findOne({
      username: this.username,
    });
    if (user) {
      this.username = `${this.username}_${nanoid(4)}`;
    }
    this.username = this.email.split("@")[0];
    this.email = this.email.toLowerCase();
  }
  next();
});

// Method to check password validity
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Method to generate user token
userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRY,
    },
  );
};

// Method to check if user has liked an article
userSchema.methods.hasLikedArticle = function (articleId: ObjectId | string) {
  return this.likedArticles.includes(articleId);
};

// Method to toggle article like
userSchema.methods.toggleArticleLike = async function (
  articleId: ObjectId | string,
) {
  if (this.hasLikedArticle(articleId)) {
    this.likedArticles.pull(articleId);
    await Article.findByIdAndUpdate(articleId, { $pull: { likes: this._id } });
  } else {
    this.likedArticles.push(articleId);
    await Article.findByIdAndUpdate(articleId, { $push: { likes: this._id } });
  }
  return this.save();
};

// Method to check if user has hearted an article
userSchema.methods.hasHeartedArticle = function (articleId: ObjectId | string) {
  return this.hearts.includes(articleId);
};

// Method to toggle article heart
userSchema.methods.toggleArticleHeart = async function (
  articleId: ObjectId | string,
) {
  if (this.hasHeartedArticle(articleId)) {
    this.hearts.pull(articleId);
    await Article.findByIdAndUpdate(articleId, { $pull: { hearts: this._id } });
  } else {
    this.hearts.push(articleId);
    await Article.findByIdAndUpdate(articleId, { $push: { hearts: this._id } });
  }
  return this.save();
};

// Method to check if user has disliked an article
userSchema.methods.hasDislikedArticle = function (
  articleId: ObjectId | string,
) {
  return this.disLikedArticles.includes(articleId);
};

// Method to toggle article dislike
userSchema.methods.toggleArticleDislike = async function (
  articleId: ObjectId | string,
) {
  if (this.hasDislikedArticle(articleId)) {
    this.disLikedArticles.pull(articleId);
    await Article.findByIdAndUpdate(articleId, {
      $pull: { dislikes: this._id },
    });
  } else {
    this.disLikedArticles.push(articleId);
    await Article.findByIdAndUpdate(articleId, {
      $push: { dislikes: this._id },
    });
  }
  return this.save();
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.password;
  },
});

// userSchema.methods.toJSON = function () {
//   const user = this.toObject();
//   delete user.password;
//   return user;
// };

userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

// Update the `updatedAt` field before saving
userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

//index the user schema
userSchema.index({ email: 1, username: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
