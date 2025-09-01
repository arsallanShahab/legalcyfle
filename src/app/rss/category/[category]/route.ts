import client from "@/lib/contentful";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    category: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { category } = params;
    console.log(`Generating RSS for category: ${category}`);

    // First, get the category ID by slug
    const categoryData = await client.getEntries({
      content_type: "blogCategory",
      "fields.slug": category,
      limit: 1,
    });

    if (categoryData.items.length === 0) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const categoryEntry = categoryData.items[0];
    const categoryName = (categoryEntry.fields?.name as string) || category;
    const categoryId = categoryEntry.sys.id;
    let articles;
    try {
      articles = await client.getEntries({
        content_type: "blogPage",
        "fields.category.sys.id[in]": [categoryId],
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
    } catch (error) {
      // Fallback: Get all articles and filter client-side
      console.log("Fallback to client-side filtering, error:", error);
      const allArticles = await client.getEntries({
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
        limit: 100,
        include: 2,
      });

      console.log(`Total articles fetched: ${allArticles.items.length}`);

      // Filter articles by category slug client-side
      const filteredItems = allArticles.items.filter((article: any) => {
        const hasCategory = article.fields.category?.some(
          (cat: any) => cat.fields?.slug === category,
        );
        return hasCategory;
      });

      console.log(
        `Filtered articles for category ${category}: ${filteredItems.length}`,
      );

      articles = {
        ...allArticles,
        items: filteredItems.slice(0, 25), // Limit to 25 items
      };
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://legalcyfle.in";
    const buildDate = new Date().toUTCString();

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>LegalCyfle - ${categoryName}</title>
    <description>Latest ${categoryName.toLowerCase()} news and analysis from LegalCyfle</description>
    <link>${baseUrl}/category/${category}</link>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} LegalCyfle. All rights reserved.</copyright>
    <managingEditor>editor@legalcyfle.com (LegalCyfle Editorial Team)</managingEditor>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <generator>LegalCyfle Category RSS Generator v1.0</generator>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo-rss.png</url>
      <title>LegalCyfle - ${categoryName}</title>
      <link>${baseUrl}/category/${category}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link href="${baseUrl}/rss/category/${category}" rel="self" type="application/rss+xml"/>
    ${articles.items
      .map((article: any) => {
        const publishDate = new Date(
          article.fields.date || article.sys.createdAt,
        ).toUTCString();

        // Get first author from authors array
        const author =
          article.fields.authors?.[0]?.fields?.name ||
          "LegalCyfle Editorial Team";

        // Get image URL from image field
        const imageUrl = article.fields.image?.fields?.file?.url
          ? `https:${article.fields.image.fields.file.url}`
          : `${baseUrl}/thumbnail.png`;

        return `
    <item>
      <title><![CDATA[${article.fields.title}]]></title>
      <description><![CDATA[${article.fields.description || ""}]]></description>
      <link>${baseUrl}/${article.fields.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${article.fields.slug}</guid>
      <pubDate>${publishDate}</pubDate>
      <author>editor@legalcyfle.com (${author})</author>
      <dc:creator>${author}</dc:creator>
      <category>${categoryName}</category>
      <media:thumbnail url="${imageUrl}" width="300" height="200"/>
      <enclosure url="${imageUrl}" type="image/jpeg" length="0"/>
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
    console.error("Error generating category RSS feed:", error);
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}
