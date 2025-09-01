import client from "@/lib/contentful";
import {
  cleanDescription,
  formatRSSDate,
  getAuthorName,
  getCategoryInfo,
  getImageUrl,
  validateBlogFields,
} from "@/lib/rss-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get recent articles with correct field names from Contentful
    const articles = await client.getEntries({
      content_type: "blogPage",
      select: [
        "fields.title",
        "fields.description",
        "fields.slug",
        "fields.date",
        "fields.authors",
        "fields.category",
        "fields.image",
        "sys.createdAt",
        "sys.updatedAt",
      ],
      order: ["-fields.date", "-sys.createdAt"],
      limit: 50,
      include: 2,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://legalcyfle.in";
    const buildDate = new Date().toUTCString();

    // Enhanced RSS feed with more metadata
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>LegalCyfle - Latest Legal News &amp; Analysis</title>
    <description>Comprehensive legal insights, case analysis, and law updates from LegalCyfle. Stay informed with the latest developments in corporate law, litigation, regulations, and legal practice.</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} LegalCyfle. All rights reserved.</copyright>
    <managingEditor>editor@legalcyfle.com (LegalCyfle Editorial Team)</managingEditor>
    <webMaster>webmaster@legalcyfle.com (LegalCyfle Technical Team)</webMaster>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <generator>LegalCyfle RSS Generator v2.0</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>30</ttl>
    <image>
      <url>${baseUrl}/logo-rss.png</url>
      <title>LegalCyfle</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
      <description>LegalCyfle Legal News</description>
    </image>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${articles.items
      .filter(validateBlogFields) // Only include valid articles
      .map((article: any) => {
        const publishDate = formatRSSDate(
          article.fields.date || article.sys.createdAt,
        );
        const updateDate = formatRSSDate(article.sys.updatedAt);

        // Use helper functions for safe field access
        const author = getAuthorName(article);
        const categoryInfo = getCategoryInfo(article);
        const imageUrl = getImageUrl(article, baseUrl);
        const cleanDesc = cleanDescription(article.fields.description);

        return `
    <item>
      <title><![CDATA[${article.fields.title}]]></title>
      <description><![CDATA[${cleanDesc}]]></description>
      <link>${baseUrl}/${article.fields.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${article.fields.slug}</guid>
      <pubDate>${publishDate}</pubDate>
      <lastBuildDate>${updateDate}</lastBuildDate>
      <author>editor@legalcyfle.com (${author})</author>
      <dc:creator>${author}</dc:creator>
      <category domain="${baseUrl}/category/${categoryInfo.slug}">${categoryInfo.name}</category>
      <media:thumbnail url="${imageUrl}" width="300" height="200"/>
      <enclosure url="${imageUrl}" type="image/jpeg" length="0"/>
      <source url="${baseUrl}/rss.xml">LegalCyfle RSS</source>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=1800", // Cache for 30 minutes
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}
