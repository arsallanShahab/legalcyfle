import IUser from "./user";

export interface IArticle {
  _id: string;
  slug: string;
  views: number;
  likes: string[];
  dislikes: string[];
  hearts: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id?: string;
  content: string;
  author: Partial<IUser>;
  article: string;
  createdAt?: string;
  updatedAt?: string;
}
