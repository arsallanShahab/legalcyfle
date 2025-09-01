import client from "@/lib/contentful";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get recent articles with correct field names
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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // JSON Feed v1.1 specification
    const jsonFeed = {
      version: "https://jsonfeed.org/version/1.1",
      title: "LegalCyfle - Legal News & Analysis",
      description:
        "Comprehensive legal insights, case analysis, and law updates from LegalCyfle",
      home_page_url: baseUrl,
      feed_url: `${baseUrl}/api/feed.json`,
      icon: `${baseUrl}/favicon.ico`,
      favicon: `${baseUrl}/favicon.ico`,
      language: "en",
      authors: [
        {
          name: "LegalCyfle Editorial Team",
          url: `${baseUrl}/about-us`,
          avatar: `${baseUrl}/logo-black.png`,
        },
      ],
      items: articles.items.map((article: any) => {
        const publishDate = new Date(
          article.fields.date || article.sys.createdAt,
        ).toISOString();
        const updateDate = new Date(article.sys.updatedAt).toISOString();

        // Get first author from authors array
        const author =
          article.fields.authors?.[0]?.fields?.name ||
          "LegalCyfle Editorial Team";

        // Get first category from category array
        const category =
          article.fields.category?.[0]?.fields?.name || "Legal News";

        // Get image URL from image field
        const imageUrl = article.fields.image?.fields?.file?.url
          ? `https:${article.fields.image.fields.file.url}`
          : `${baseUrl}/thumbnail.png`;

        return {
          id: `${baseUrl}/${article.fields.slug}`,
          url: `${baseUrl}/${article.fields.slug}`,
          title: article.fields.title,
          content_text: article.fields.description || "",
          summary: article.fields.description || "",
          image: imageUrl,
          banner_image: imageUrl,
          date_published: publishDate,
          date_modified: updateDate,
          author: {
            name: author,
            url: `${baseUrl}/author/${author.toLowerCase().replace(/\s+/g, "-")}`,
          },
          tags: [category],
          language: "en",
        };
      }),
    };

    return NextResponse.json(jsonFeed, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800", // Cache for 30 minutes
      },
    });
  } catch (error) {
    console.error("Error generating JSON feed:", error);
    return NextResponse.json(
      { error: "Error generating JSON feed" },
      { status: 500 },
    );
  }
}
