import { google } from "googleapis";

// Google Indexing API implementation
export class GoogleIndexingAPI {
  private indexing;

  constructor() {
    // Initialize the Google Indexing API
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey) {
      throw new Error(
        "GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set",
      );
    }

    let credentials;
    try {
      // Check if the service account key is already parsed JSON or needs to be parsed
      let cleanedKey: string;

      if (typeof serviceAccountKey === "string") {
        cleanedKey = serviceAccountKey.trim();
        // Try to parse as JSON if it's a string
        credentials = JSON.parse(cleanedKey);
      } else if (
        typeof serviceAccountKey === "object" &&
        serviceAccountKey !== null
      ) {
        // Already a parsed object
        credentials = serviceAccountKey;
      } else {
        throw new Error("Service account key must be a JSON string or object");
      }
    } catch (error) {
      console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:", error);
      console.error(
        "First 100 characters of key:",
        serviceAccountKey.substring(0, 100),
      );
      throw new Error(
        `Invalid JSON in GOOGLE_SERVICE_ACCOUNT_KEY: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }

    this.indexing = google.indexing({
      version: "v3",
      auth: new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ["https://www.googleapis.com/auth/indexing"],
      }),
    });
  }

  async requestIndexing(
    url: string,
    type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED",
  ) {
    try {
      const response = await this.indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: type,
        },
      });

      console.log("Indexing request sent:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error requesting indexing:", error);
      throw error;
    }
  }

  async getIndexingStatus(url: string) {
    try {
      const response = await this.indexing.urlNotifications.getMetadata({
        url: url,
      });

      return response.data;
    } catch (error) {
      console.error("Error getting indexing status:", error);
      throw error;
    }
  }
}

// Utility function to submit URL for indexing
export async function submitUrlForIndexing(url: string) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.warn("Google Service Account not configured for indexing API");
    return null;
  }

  try {
    const indexingAPI = new GoogleIndexingAPI();
    const result = await indexingAPI.requestIndexing(url);
    return result;
  } catch (error) {
    console.error("Failed to submit URL for indexing:", error);
    return null;
  }
}
