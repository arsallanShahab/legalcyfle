import { GoogleIndexingAPI } from "@/lib/google-indexing";
import { NextRequest, NextResponse } from "next/server";

// Google Indexing using your configured GCP setup
async function submitToGoogleIndexing(url: string) {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      return {
        success: false,
        error: "Google Service Account not configured",
      };
    }

    const indexingAPI = new GoogleIndexingAPI();
    const data = await indexingAPI.requestIndexing(url, "URL_UPDATED");
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function pingSearchEngines(url: string) {
  const sitemapUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`;

  const pingUrls = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ];

  const results = await Promise.allSettled(
    pingUrls.map(async (pingUrl) => {
      try {
        const response = await fetch(pingUrl);
        return {
          url: pingUrl,
          success: response.ok,
          status: response.status,
        };
      } catch (error) {
        return {
          url: pingUrl,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),
  );

  return results;
}

async function submitToSearchConsole(url: string) {
  try {
    // Using your Google Indexing API for status check
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      return {
        success: false,
        message: "Google Service Account not configured for Search Console API",
      };
    }

    const indexingAPI = new GoogleIndexingAPI();
    // Check indexing status instead of submitting (optional feature)
    try {
      const status = await indexingAPI.getIndexingStatus(url);
      return {
        success: true,
        message: "Indexing status retrieved",
        data: status,
      };
    } catch (error) {
      return {
        success: true,
        message: "Search Console API - Status check not available for this URL",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, url, urls } = body;

    // Verify admin access using the same password system as the existing auth
    const adminPassword = process.env.ADMIN_PASSWORD;
    const providedPassword = request.headers.get("x-admin-password");

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    console.log(adminPassword, "admin", providedPassword, "provided");

    if (!providedPassword || providedPassword !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results: any = {
      timestamp: new Date().toISOString(),
      action,
    };

    switch (action) {
      case "single-url":
        if (!url) {
          return NextResponse.json(
            { error: "URL is required for single URL indexing" },
            { status: 400 },
          );
        }

        const [googleResult, searchEngineResults, searchConsoleResult] =
          await Promise.allSettled([
            submitToGoogleIndexing(url),
            pingSearchEngines(url),
            submitToSearchConsole(url),
          ]);

        results.url = url;
        results.google =
          googleResult.status === "fulfilled"
            ? googleResult.value
            : { success: false, error: "Failed to submit" };
        results.searchEngines =
          searchEngineResults.status === "fulfilled"
            ? searchEngineResults.value
            : { success: false, error: "Failed to ping" };
        results.searchConsole =
          searchConsoleResult.status === "fulfilled"
            ? searchConsoleResult.value
            : { success: false, error: "Failed to submit" };
        break;

      case "bulk-urls":
        if (!urls || !Array.isArray(urls) || urls.length === 0) {
          return NextResponse.json(
            { error: "URLs array is required for bulk indexing" },
            { status: 400 },
          );
        }

        const bulkResults = await Promise.allSettled(
          urls.map(async (singleUrl: string) => {
            const [googleRes, searchConsoleRes] = await Promise.allSettled([
              submitToGoogleIndexing(singleUrl),
              submitToSearchConsole(singleUrl),
            ]);

            return {
              url: singleUrl,
              google:
                googleRes.status === "fulfilled"
                  ? googleRes.value
                  : { success: false, error: "Failed" },
              searchConsole:
                searchConsoleRes.status === "fulfilled"
                  ? searchConsoleRes.value
                  : { success: false, error: "Failed" },
            };
          }),
        );

        // Also ping search engines once for sitemap
        const bulkSearchEngineResults = await pingSearchEngines(urls[0]);

        results.urls = urls;
        results.results = bulkResults.map((result) =>
          result.status === "fulfilled"
            ? result.value
            : { error: "Failed to process" },
        );
        results.searchEngines = bulkSearchEngineResults;
        break;

      case "sitemap-ping":
        const sitemapResults = await pingSearchEngines("");
        results.searchEngines = sitemapResults;
        break;

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Use 'single-url', 'bulk-urls', or 'sitemap-ping'",
          },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      message: "Indexing request processed",
      results,
    });
  } catch (error) {
    console.error("Manual indexing error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
