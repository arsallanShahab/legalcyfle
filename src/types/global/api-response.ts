import { ObjectId } from "mongoose";
import { Comment, IArticle } from "./article";

export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  message: string;
}

export interface MetricsResponse {
  article: IArticle;
  comments: Comment[];
  like: number;
  view: number;
  comment: number;
  dislikes: number;
  hearts: number;
  isLiked: boolean;
  isHearted: boolean;
  isDisliked: boolean;
}

export interface LikeResponse {
  isLiked: boolean;
  likes: number;
}

export interface HeartResponse {
  isHearted: boolean;
  hearts: number;
}

export interface DislikeResponse {
  isDisliked: boolean;
  dislikes: number;
}
