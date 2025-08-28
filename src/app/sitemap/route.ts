import client from "@/lib/contentful";
import { NextRequest, NextResponse } from "next/server";

// Dynamic sitemap that updates in real-time
export async function GET(request: NextRequest) {
  try {
    // Get all published articles
    const articles = await client.getEntries({
      content_type: "blogPage",
      select: ["fields.slug", "fields.date", "sys.updatedAt"],
      order: ["-sys.updatedAt"], // Most recent first
      limit: 1000,
    });

    // Create XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${process.env.NEXT_PUBLIC_BASE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${articles.items
    .map((article: any) => {
      const publishDate = article.fields.date || article.sys.createdAt;
      const lastMod = article.sys.updatedAt;
      const isRecent =
        new Date(publishDate) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Last 2 days

      return `
  <url>
    <loc>${process.env.NEXT_PUBLIC_BASE_URL}/${article.fields.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${isRecent ? "hourly" : "weekly"}</changefreq>
    <priority>${isRecent ? "0.9" : "0.7"}</priority>
    ${
      isRecent
        ? `
    <news:news>
      <news:publication>
        <news:name>LegalCyfle</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publishDate}</news:publication_date>
      <news:title><![CDATA[${article.fields.title}]]></news:title>
    </news:news>`
        : ""
    }
  </url>`;
    })
    .join("")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
