import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: string | ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  likedArticles: string[];
  disLikedArticles: string[];
  hearts: string[];
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
  username: string;
  comparePassword: (password: string) => Promise<boolean>;
  generateToken: () => string;
  hasLikedArticle: (articleId: ObjectId | string) => boolean;
  hasDislikedArticle: (articleId: ObjectId | string) => boolean;
  hasHeartedArticle: (articleId: ObjectId | string) => boolean;
  toggleArticleLike: (articleId: ObjectId | string) => Promise<IUser>;
  toJSON: () => Omit<IUser, "password">;
  getFullName: () => string;
}

export default IUser;
