import { Document, Block, Inline, Text } from "@contentful/rich-text-types";
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
      body: minifyRichText(article.fields?.body) || null,
    },
  };
}

/**
 * Minifies a Contentful Rich Text Document.
 * Removes unused metadata and fields from embedded assets/entries.
 */
function minifyRichText(document: Document | null): Document | null {
  if (!document) return null;

  return {
    nodeType: document.nodeType,
    data: document.data,
    content: document.content.map(minifyNode),
  } as Document;
}

function minifyNode(node: Block | Inline | Text): any {
  const minifiedNode: any = {
    nodeType: node.nodeType,
    data: {},
    content: [],
  };

  // Handle Text nodes
  if (node.nodeType === "text") {
    minifiedNode.value = (node as Text).value;
    minifiedNode.marks = (node as Text).marks;
    // Text nodes don't have content or data
    delete minifiedNode.content;
    delete minifiedNode.data;
    return minifiedNode;
  }

  // Handle Data (Embedded Assets/Entries)
  if (node.data) {
    minifiedNode.data = { ...node.data };

    // Minify target if it exists (Embedded Asset/Entry)
    if (minifiedNode.data.target) {
      const target = minifiedNode.data.target;

      // Check if it's an Asset or Entry based on sys.type or fields
      // Usually we can check fields.file for Asset
      if (target.fields) {
        if (target.fields.file) {
          // It's an Asset
          minifiedNode.data.target = {
            fields: {
              title: target.fields.title,
              file: {
                url: target.fields.file.url,
                contentType: target.fields.file.contentType,
              },
            },
          };
        } else {
          // It's likely an Entry (e.g. embedded-entry-inline)
          // We only need title and slug for links
          minifiedNode.data.target = {
            fields: {
              title: target.fields.title,
              slug: target.fields.slug,
            },
          };
        }
      }
    }
  }

  // Recursively minify content
  if ((node as Block | Inline).content) {
    minifiedNode.content = (node as Block | Inline).content.map(minifyNode);
  }

  return minifiedNode;
}
