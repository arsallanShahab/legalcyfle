import { BlogEntry } from "@/types/contentful/blog";

// Helper function to validate RSS feed data
export function validateBlogFields(article: any): boolean {
  const requiredFields = [
    "fields.title",
    "fields.slug",
    "fields.date",
    "fields.description",
  ];

  return requiredFields.every((field) => {
    const value = field.split(".").reduce((obj, key) => obj?.[key], article);
    return value !== undefined && value !== null;
  });
}

// Helper function to safely get author name
export function getAuthorName(article: any): string {
  return (
    article.fields.authors?.[0]?.fields?.name || "LegalCyfle Editorial Team"
  );
}

// Helper function to safely get category info
export function getCategoryInfo(article: any): { name: string; slug: string } {
  const category = article.fields.category?.[0];
  return {
    name: category?.fields?.name || "Legal News",
    slug: category?.fields?.slug || "legal-news",
  };
}

// Helper function to safely get image URL
export function getImageUrl(article: any, baseUrl: string): string {
  const imageUrl = article.fields.image?.fields?.file?.url;
  return imageUrl ? `https:${imageUrl}` : `${baseUrl}/thumbnail.png`;
}

// Helper function to format date for RSS
export function formatRSSDate(date: string): string {
  return new Date(date).toUTCString();
}

// Helper function to clean up description for RSS
export function cleanDescription(description: string | undefined): string {
  if (!description) return "";

  // Remove HTML tags and trim
  return description.replace(/<[^>]*>/g, "").trim();
}

// RSS field mapping based on BlogEntry type
export const RSS_FIELD_MAPPING = {
  // Main fields from BlogEntry
  title: "fields.title",
  slug: "fields.slug",
  description: "fields.description",
  date: "fields.date",

  // Related fields (arrays)
  authors: "fields.authors", // Array of Author objects
  category: "fields.category", // Array of Category objects
  image: "fields.image", // Image object

  // System fields
  createdAt: "sys.createdAt",
  updatedAt: "sys.updatedAt",
} as const;

// Category field mapping
export const CATEGORY_MAPPING = {
  name: "fields.name",
  slug: "fields.slug",
  image: "fields.image",
} as const;

// Author field mapping
export const AUTHOR_MAPPING = {
  name: "fields.name",
  bio: "fields.bio",
  avatar: "fields.avatar",
} as const;
