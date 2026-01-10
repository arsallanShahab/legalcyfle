import { Document } from "@contentful/rich-text-types";
import { minifyRichText } from "contentful-rt-utils";
import { richTextToMarkdown } from "./rich-text-to-markdown";

/**
 * Minifies a Contentful Job entry to reduce payload size.
 * Specifically tailored for the Jobs page requirements.
 */
export function minifyJob(job: any): any {
  if (!job) return null;

  return {
    sys: {
      id: job.sys.id,
    },
    fields: {
      title: job.fields?.title || null,
      articles: Array.isArray(job.fields?.articles)
        ? job.fields.articles
            .map(minifyArticle)
            .filter((article: any) => article !== null)
        : [],
    },
  };
}

export function minifyJobToMarkdown(job: any): any {
  if (!job) return null;

  return {
    sys: {
      id: job.sys.id,
    },
    fields: {
      title: job.fields?.title || null,
      articles: Array.isArray(job.fields?.articles)
        ? job.fields.articles
            .map(minifyArticleToMarkdown)
            .filter((article: any) => article !== null)
        : [],
    },
  };
}

function minifyArticleToMarkdown(article: any): any {
  if (!article || !article.fields) return null;

  return {
    sys: {
      id: article.sys.id,
      createdAt: article.sys.createdAt || null,
    },
    fields: {
      title: article.fields?.title || null,
      date: article.fields?.date || null,
      // Convert body to markdown string
      body: richTextToMarkdown(article.fields?.body) || "",
    },
  };
}

/**
 * Minifies a BlogEntry (Article) for the Jobs page.
 */
function minifyArticle(article: any): any {
  if (!article || !article.fields) return null;

  return {
    sys: {
      id: article.sys.id,
      createdAt: article.sys.createdAt || null,
    },
    fields: {
      title: article.fields?.title || null,
      date: article.fields?.date || null,
      // We only need body for rendering content
      body: minifyRichTextContent(article.fields?.body) || null,
    },
  };
}

/**
 * Minifies a Contentful Rich Text Document using contentful-rt-minifier.
 * Removes unused metadata while preserving content structure.
 */
function minifyRichTextContent(document: Document | null): Document | null {
  if (!document) return null;

  const minified = minifyRichText(document, {
    // Keep essential fields for Entries (e.g., embedded content references)
    keepEntryFields: ["title", "slug"],
    // Keep essential fields for Assets with dot notation support
    keepAssetFields: ["title", "file.url", "file.contentType"],
  });

  console.log("Minified Rich Text Document:", JSON.stringify(minified));

  return minified;
}
