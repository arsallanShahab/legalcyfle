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
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!, "base64").toString(
        "utf-8",
      ),
    );

    // Fix newlines in private key (not usually needed here, but safe)
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(
        /\\n/g,
        "\n",
      );
    }

    this.indexing = google.indexing({
      version: "v3",
      auth: new google.auth.GoogleAuth({
        credentials: serviceAccount,
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
