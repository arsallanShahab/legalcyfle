import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("=== CONTENTFUL WEBHOOK ===");

    // Verify it's a Contentful webhook
    const contentfulTopic = req.headers["x-contentful-topic"];
    if (!contentfulTopic) {
      return res.status(400).json({ message: "Invalid webhook source" });
    }

    // Parse body if it's a string
    let parsedBody;
    if (typeof req.body === "string") {
      try {
        parsedBody = JSON.parse(req.body);
      } catch (parseError) {
        return res
          .status(400)
          .json({ message: "Invalid JSON in webhook payload" });
      }
    } else {
      parsedBody = req.body;
    }

    const { sys, fields } = parsedBody;

    if (!sys || !sys.contentType) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    // Handle different contentType structures
    let contentType;
    if (typeof sys.contentType === "string") {
      contentType = sys.contentType;
    } else if (sys.contentType.sys && sys.contentType.sys.id) {
      contentType = sys.contentType.sys.id;
    } else {
      return res.status(400).json({ message: "Invalid contentType structure" });
    }

    const revalidationSecret = process.env.REVALIDATION_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    console.log(`Webhook: ${contentType} - ${sys.id} - ${contentfulTopic}`);
    console.log(`Entry type: ${sys.type}`);

    // Helper function to extract field values
    const getFieldValue = (field: any, locale = "en-US") => {
      return field?.[locale] || field;
    };

    // Helper function to make revalidation calls with timeout
    const revalidateWithTimeout = async (
      url: string,
      body: any,
      timeoutMs = 15000,
    ) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        console.log(`Attempting revalidation: ${url}`);
        console.log(`Request body:`, JSON.stringify(body, null, 2));

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const responseData = await response.text();
          console.log(
            `Revalidation success: ${url} - Status: ${response.status}`,
          );
          console.log(`Response:`, responseData);
        } else {
          const errorText = await response.text();
          console.log(
            `Revalidation failed: ${url} - Status: ${response.status}`,
          );
          console.log(`Error response:`, errorText);
        }
        return response;
      } catch (error) {
        console.error(
          `Revalidation failed: ${url} - ${error instanceof Error ? error.message : error}`,
        );
        return null;
      }
    };

    // Respond immediately to prevent timeout
    res.status(200).json({
      success: true,
      contentType,
      entryId: sys.id,
      topic: contentfulTopic,
      entryType: sys.type,
      timestamp: new Date().toISOString(),
    });

    // Process revalidation asynchronously - don't block response
    setImmediate(async () => {
      try {
        if (sys.type === "DeletedEntry") {
          console.log(`Processing deleted ${contentType}: ${sys.id}`);
          // For deleted entries, just revalidate homepage to remove from listings
          await revalidateWithTimeout(`${baseUrl}/api/revalidate`, {
            secret: revalidationSecret,
            path: "/",
          });
          return;
        }

        // Handle regular entries (published/updated)
        switch (contentType) {
          case "blogPage":
            const slug = getFieldValue(fields?.slug);
            const categories = getFieldValue(fields?.category);
            const authors = getFieldValue(fields?.authors);

            console.log(`Revalidating blog page: ${slug}`);
            console.log(`Categories:`, categories);
            console.log(`Authors:`, authors);

            await revalidateWithTimeout(`${baseUrl}/api/revalidate/article`, {
              secret: revalidationSecret,
              slug: slug,
              categorySlug: categories?.[0]?.sys?.id,
              authorId: authors?.[0]?.sys?.id,
            });
            break;

          case "author":
            console.log(`Revalidating author: ${sys.id}`);
            await revalidateWithTimeout(`${baseUrl}/api/revalidate/author`, {
              secret: revalidationSecret,
              authorId: sys.id,
            });
            break;

          case "blogCategory":
            const categorySlug = getFieldValue(fields?.slug);
            console.log(`Revalidating category: ${categorySlug}`);
            await revalidateWithTimeout(`${baseUrl}/api/revalidate/category`, {
              secret: revalidationSecret,
              slug: categorySlug,
            });
            break;

          default:
            console.log(`Unhandled content type: ${contentType}`);
        }

        console.log(
          `Webhook processing completed for ${contentType}: ${sys.id}`,
        );
      } catch (error) {
        console.error("Async revalidation error:", error);
      }
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
