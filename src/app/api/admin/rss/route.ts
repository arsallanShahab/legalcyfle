import client from "@/lib/contentful";
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

    const categories = await client.getEntries({
      content_type: "blogCategory",
      select: ["fields.slug"],
    });
    const categorySlugs = categories.items.map(
      (item) => `/rss/category/${item.fields.slug}`,
    );
    console.log(`Found categories: ${categorySlugs.join(", ")}`);

    if (action === "refresh-feeds") {
      // Revalidate all RSS/JSON feeds
      const feedPaths = ["/rss.xml", "/api/feed.json", ...categorySlugs];

      feedPaths.forEach((path) => {
        revalidatePath(path);
      });

      // Ping RSS aggregators
      //   const pingResults = await pingRSSAggregators();

      return NextResponse.json({
        success: true,
        message: "RSS feeds refreshed",
        feedPaths,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("RSS management error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

async function pingRSSAggregators() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const rssUrl = `${baseUrl}/rss.xml`;

  // RSS aggregators and ping services
  const pingServices = [
    `http://rpc.pingomatic.com/`,
    `http://ping.feedburner.com/`,
    `http://ping.blogs.yandex.ru/ping?rss=${encodeURIComponent(rssUrl)}`,
    // Google doesn't have RSS ping, but we can submit to indexing API
  ];

  const results = await Promise.allSettled(
    pingServices.slice(2).map(async (pingUrl) => {
      // Skip RPC services for now
      try {
        const response = await fetch(pingUrl, { method: "GET" });
        return {
          service: pingUrl.includes("yandex") ? "Yandex" : "Unknown",
          success: response.ok,
          status: response.status,
        };
      } catch (error) {
        return {
          service: pingUrl.includes("yandex") ? "Yandex" : "Unknown",
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
