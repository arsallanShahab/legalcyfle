import { ObjectId } from "mongoose";

export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  message: string;
}

export interface MetricsResponse {
  like: number;
  view: number;
  comment: number;
  dislikes: number;
  hearts: number;
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
