import {
  estimateReadingTime,
  formatImageLink,
  generateKeywords,
} from "@/lib/utils";
import { BlogEntry } from "@/types/contentful/blog";
import { IArticle } from "@/types/global/article";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { Document } from "@contentful/rich-text-types";
import Head from "next/head";
import React from "react";

interface ArticleSEOProps {
  article: BlogEntry;
  metrics: IArticle | null;
  url: string;
}

const ArticleSEO: React.FC<ArticleSEOProps> = ({ article, metrics, url }) => {
  const thumbnail =
    article?.fields?.image?.fields?.file?.url ||
    "https://picsum.photos/500/500";

  const articleContent = documentToHtmlString(article.fields.body as Document);

  const readingTime = estimateReadingTime(articleContent);

  const wordCount = articleContent
    .replace(/<[^>]*>/g, "")
    .split(" ")
    .filter((word) => word.length > 0).length;

  const publishDate = article.fields.date || article.sys.createdAt;
  const modifiedDate = article.sys.updatedAt;

  const authorNames = article.fields.authors
    .map((author) => author.fields.name)
    .join(", ");

  const categoryNames = article.fields.category
    .map((cat) => cat.fields.name)
    .join(", ");

  const optimizedMetaDescription =
    article.fields.description && article.fields.description.length > 160
      ? article.fields.description.substring(0, 157) + "..."
      : article.fields.description ||
        `Expert legal insights on ${article.fields.title}. Read analysis by ${authorNames} on LegalCyfle.`;

  const keywords = generateKeywords(
    article.fields?.category?.map((cat) => cat.fields.name),
    article.fields?.title,
    article.fields?.description ?? "",
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}/#article`,
        isPartOf: { "@id": `${url}/` },
        author: article.fields.authors.map((author) => ({
          "@id": `https://legalcyfle.in/author/${author.sys.id}/#person`,
          "@type": "Person",
          name: author.fields.name,
          url: `https://legalcyfle.in/author/${author.sys.id}/`,
          image: {
            "@type": "ImageObject",
            inLanguage: "en-US",
            "@id": `https://legalcyfle.in/author/${author.sys.id}/#image`,
            url: formatImageLink(author?.fields?.avatar?.fields?.file?.url),
            contentUrl: formatImageLink(
              author?.fields?.avatar?.fields?.file?.url,
            ),
            caption: author.fields.name,
            width:
              author?.fields?.avatar?.fields?.file?.details?.image?.width ||
              400,
            height:
              author?.fields?.avatar?.fields?.file?.details?.image?.height ||
              400,
          },
          sameAs: [],
          description:
            author?.fields?.bio || `Legal expert and contributor at LegalCyfle`,
          jobTitle: "Legal Expert",
          worksFor: {
            "@type": "Organization",
            "@id": "https://legalcyfle.in/#organization",
            name: "LegalCyfle",
          },
          knowsAbout: article.fields.category.map((cat) => cat.fields.name),
        })),
        headline: article.fields.title,
        alternativeHeadline: article.fields.title,
        description: optimizedMetaDescription,
        datePublished: publishDate,
        dateModified: modifiedDate,
        dateCreated: article.sys.createdAt,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${url}/`,
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://legalcyfle.in/#organization",
          name: "LegalCyfle",
          logo: {
            "@type": "ImageObject",
            "@id": "https://legalcyfle.in/#logo",
            inLanguage: "en-US",
            url: "https://legalcyfle.in/logo-black.png",
            contentUrl: "https://legalcyfle.in/logo-black.png",
            width: 1500,
            height: 1500,
            caption: "LegalCyfle",
          },
        },
        image: {
          "@type": "ImageObject",
          "@id": `${url}/#primaryimage`,
          inLanguage: "en-US",
          url: formatImageLink(thumbnail),
          contentUrl: formatImageLink(thumbnail),
          width:
            article?.fields?.image?.fields?.file?.details?.image?.width || 1280,
          height:
            article?.fields?.image?.fields?.file?.details?.image?.height || 720,
          caption: article.fields.title,
          representativeOfPage: true,
        },
        thumbnailUrl: formatImageLink(thumbnail),
        keywords: keywords,
        articleSection: categoryNames,
        articleBody: articleContent.replace(/<[^>]*>/g, ""),
        wordCount: wordCount,
        timeRequired: `PT${readingTime}M`,
        inLanguage: "en-US",
        copyrightYear: new Date(publishDate).getFullYear(),
        copyrightHolder: {
          "@type": "Organization",
          "@id": "https://legalcyfle.in/#organization",
          name: "LegalCyfle",
        },
        license: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
        potentialAction: [
          {
            "@type": "ReadAction",
            target: [`${url}/`],
          },
          {
            "@type": "ShareAction",
            target: [`${url}/`],
          },
        ],
        about: article.fields.category.map((cat) => ({
          "@type": "Thing",
          name: cat.fields.name,
          url: `https://legalcyfle.in/category/${cat.fields.slug}/`,
          sameAs: `https://legalcyfle.in/category/${cat.fields.slug}/`,
        })),
        mentions: article.fields.category.map((cat) => ({
          "@type": "Thing",
          name: cat.fields.name,
          url: `https://legalcyfle.in/category/${cat.fields.slug}/`,
        })),
        isAccessibleForFree: true,
        hasPart: [
          {
            "@type": "WebPageElement",
            isAccessibleForFree: true,
            cssSelector: ".article-content",
          },
        ],
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".article-intro", ".article-summary"],
        },
      },
      {
        "@type": "WebPage",
        "@id": `${url}/`,
        url: `${url}/`,
        name: `${article.fields.title} - LegalCyfle`,
        isPartOf: { "@id": "https://legalcyfle.in/#website" },
        primaryImageOfPage: {
          "@id": `${url}/#primaryimage`,
        },
        image: {
          "@id": `${url}/#primaryimage`,
        },
        thumbnailUrl: formatImageLink(article.fields.image.fields.file.url),
        datePublished: article.fields.date,
        dateModified: article.sys.updatedAt,
        breadcrumb: {
          "@id": `${url}/#breadcrumb`,
        },
        inLanguage: "en-US",
        potentialAction: [
          {
            "@type": "ReadAction",
            target: [`${url}/`],
          },
        ],
      },
      {
        "@type": "ImageObject",
        inLanguage: "en-US",
        "@id": `${url}/#primaryimage`,
        url: formatImageLink(article?.fields?.image?.fields?.file?.url),
        contentUrl: formatImageLink(article?.fields?.image?.fields?.file?.url),
        width: article.fields?.image?.fields?.file?.details?.image?.width,
        height: article.fields?.image?.fields?.file?.details?.image?.height,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://legalcyfle.in/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: article.fields.category[0]?.fields?.name,
            item: `https://legalcyfle.in/category/${article.fields.category[0]?.fields?.slug}`,
          },
          { "@type": "ListItem", position: 3, name: article.fields.title },
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://legalcyfle.in/#website",
        url: "https://legalcyfle.in/",
        name: "LegalCyfle",
        description: "iuris occasio omnibus",
        publisher: { "@id": "https://legalcyfle.in/#organization" },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://legalcyfle.in/search?q={search_term_string}",
            },
            "query-input": {
              "@type": "PropertyValueSpecification",
              valueRequired: true,
              valueName: "search_term_string",
            },
          },
        ],
        inLanguage: "en-US",
      },
      {
        "@type": "Organization",
        "@id": "https://legalcyfle.in/#organization",
        name: "LegalCyfle",
        url: "https://legalcyfle.in/",
        logo: {
          "@type": "ImageObject",
          inLanguage: "en-US",
          "@id": "https://legalcyfle.in/#/schema/logo/image/",
          url: "https://legalcyfle.in/logo-black.png",
          contentUrl: "https://legalcyfle.in/logo-black.png",
          width: 1500,
          height: 1500,
          caption: "LegalCyfle",
        },
        image: { "@id": "https://legalcyfle.in/#/schema/logo/image/" },
        sameAs: [
          "https://www.facebook.com/profile.php?id=61559661011805",
          "https://www.linkedin.com/company/legalcyfle-in/",
          "https://www.instagram.com/legalcyfle/?hl=en",
        ],
      },
    ],
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{`${article.fields.title} - LegalCyfle`}</title>
      <meta name="title" content={`${article.fields.title} - LegalCyfle`} />
      <meta name="description" content={optimizedMetaDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={authorNames} />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta
        name="googlebot"
        content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
      />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.country" content="India" />

      {/* Article-specific meta */}
      <meta name="article:published_time" content={publishDate} />
      <meta name="article:modified_time" content={modifiedDate} />
      <meta name="article:author" content={authorNames} />
      <meta name="article:section" content={categoryNames} />
      <meta name="article:tag" content={keywords} />

      {/* Reading time and word count */}
      <meta name="reading_time" content={`${readingTime} minutes`} />
      <meta name="word_count" content={wordCount.toString()} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={article.fields.title} />
      <meta property="og:description" content={optimizedMetaDescription} />
      <meta property="og:image" content={formatImageLink(thumbnail)} />
      <meta
        property="og:image:secure_url"
        content={formatImageLink(thumbnail)}
      />
      <meta
        property="og:image:width"
        content={(
          article?.fields?.image?.fields?.file?.details?.image?.width || 1280
        ).toString()}
      />
      <meta
        property="og:image:height"
        content={(
          article?.fields?.image?.fields?.file?.details?.image?.height || 720
        ).toString()}
      />
      <meta property="og:image:alt" content={article.fields.title} />
      <meta property="og:site_name" content="LegalCyfle" />
      <meta property="og:locale" content="en_US" />
      <meta property="article:published_time" content={publishDate} />
      <meta property="article:modified_time" content={modifiedDate} />
      <meta property="article:author" content={authorNames} />
      <meta property="article:section" content={categoryNames} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={article.fields.title} />
      <meta property="twitter:description" content={optimizedMetaDescription} />
      <meta property="twitter:image" content={formatImageLink(thumbnail)} />
      <meta property="twitter:image:alt" content={article.fields.title} />
      <meta name="twitter:creator" content="@legalcyfle" />
      <meta name="twitter:site" content="@legalcyfle" />

      {/* Additional SEO meta tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />

      {/* Schema.org for Google */}
      <meta itemProp="name" content={article.fields.title} />
      <meta itemProp="description" content={optimizedMetaDescription} />
      <meta itemProp="image" content={formatImageLink(thumbnail)} />

      {/* Performance and Preloading */}
      <link
        rel="preload"
        href={formatImageLink(thumbnail)}
        as="image"
        type="image/webp"
      />
      <link rel="dns-prefetch" href="//images.ctfassets.net" />
      <link
        rel="preconnect"
        href="https://images.ctfassets.net"
        crossOrigin=""
      />

      {/* Alternate URLs for different formats/languages */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title="LegalCyfle RSS Feed"
        href="https://legalcyfle.in/rss.xml"
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
};

export default ArticleSEO;
