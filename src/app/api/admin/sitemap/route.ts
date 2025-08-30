import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Verify admin password
    const password = request.headers.get("x-admin-password");
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json();

    if (action === "revalidate-sitemap") {
      // Revalidate sitemap and related paths
      const paths = [
        "/sitemap",
        "/robots.txt",
        "/", // Homepage might include sitemap links
      ];

      paths.forEach((path) => {
        revalidatePath(path);
      });

      return NextResponse.json({
        success: true,
        message: "Sitemap revalidated successfully",
        paths,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Sitemap revalidation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

async function pingSearchEnginesAboutSitemap(sitemapUrl: string) {
  // Note: Google deprecated the ping endpoint in 2023, but Bing still supports it
  const pingUrls = [
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    // Google ping is deprecated as per the blog post we just read
  ];

  const results = await Promise.allSettled(
    pingUrls.map(async (pingUrl) => {
      try {
        const response = await fetch(pingUrl, { method: "GET" });
        return {
          engine: pingUrl.includes("bing") ? "Bing" : "Google",
          success: response.ok,
          status: response.status,
          note: pingUrl.includes("google") ? "Google ping deprecated" : "",
        };
      } catch (error) {
        return {
          engine: pingUrl.includes("bing") ? "Bing" : "Google",
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),
  );

  return results.map((result) =>
    result.status === "fulfilled" ? result.value : result.reason,
  );
}
