import { submitUrlForIndexing } from "@/lib/google-indexing";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Webhook handler for content updates
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify webhook authenticity (implement your security check)
    const webhookSecret = request.headers.get("x-webhook-secret");
    if (webhookSecret !== process.env.CONTENTFUL_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle different webhook events
    const eventType = body.sys?.type;
    const contentType = body.sys?.contentType?.sys?.id;

    if (contentType === "blogPage") {
      const slug = body.fields?.slug?.["en-US"];

      if (eventType === "Entry" && body.sys?.updatedAt) {
        // New article published
        const articleUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`;

        console.log("New article published:", articleUrl);

        // Revalidate relevant pages
        revalidatePath("/");
        revalidatePath(`/${slug}`);
        revalidatePath("/sitemap.xml");
        revalidatePath("/rss.xml");

        // Submit to Google for indexing using your configured Google API
        await Promise.allSettled([
          submitUrlForIndexing(articleUrl),
          pingSearchEngines(articleUrl),
          notifyNewsAggregators(articleUrl),
        ]);

        return NextResponse.json({
          success: true,
          message: "Article processed for indexing",
          url: articleUrl,
        });
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Submit URL to Google for indexing
async function submitToGoogleIndexing(url: string) {
  // This function is deprecated - using submitUrlForIndexing from google-indexing.ts instead
  console.log(
    "Legacy function called - URL handled by submitUrlForIndexing:",
    url,
  );
}

// Ping search engines about sitemap updates
async function pingSearchEngines(url: string) {
  const sitemapUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`;

  const pingUrls = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];

  await Promise.allSettled(
    pingUrls.map((pingUrl) =>
      fetch(pingUrl).catch((err) => console.error("Ping error:", err)),
    ),
  );
}

// Notify news aggregators (if applicable)
async function notifyNewsAggregators(url: string) {
  // You can add specific news aggregator notifications here
  // For example, if you're part of Google News, Apple News, etc.
  console.log("Notifying news aggregators about:", url);
}
