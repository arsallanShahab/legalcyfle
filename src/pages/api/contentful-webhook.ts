import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Log the entire request for debugging
    console.log("=== CONTENTFUL WEBHOOK DEBUG ===");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));
    console.log("===============================");

    // Verify it's a Contentful webhook
    const contentfulTopic = req.headers["x-contentful-topic"];
    if (!contentfulTopic) {
      console.log("Missing X-Contentful-Topic header");
      return res.status(400).json({ message: "Invalid webhook source" });
    }

    const { sys, fields } = req.body;

    console.log("Extracted sys:", sys);
    console.log("Extracted fields:", fields);
    console.log("sys.contentType:", sys?.contentType);

    if (!sys) {
      console.log("Missing sys in payload");
      return res
        .status(400)
        .json({ message: "Invalid webhook payload - missing sys" });
    }

    if (!sys.contentType) {
      console.log("Missing contentType in sys");
      return res
        .status(400)
        .json({ message: "Invalid webhook payload - missing contentType" });
    }

    // Handle different contentType structures
    let contentType;
    if (typeof sys.contentType === "string") {
      contentType = sys.contentType;
    } else if (sys.contentType.sys && sys.contentType.sys.id) {
      contentType = sys.contentType.sys.id;
    } else {
      console.log("Invalid contentType structure:", sys.contentType);
      return res.status(400).json({ message: "Invalid contentType structure" });
    }

    const revalidationSecret = process.env.REVALIDATION_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    console.log(`Received webhook for content type: ${contentType}`);
    console.log(`Entry ID: ${sys.id}`);
    console.log(`Webhook topic: ${contentfulTopic}`);

    // Helper function to extract field values from Contentful's nested structure
    const getFieldValue = (field: any, locale = "en-US") => {
      return field?.[locale] || field;
    };

    switch (contentType) {
      case "blogPage":
        const slug = getFieldValue(fields?.slug);
        const categories = getFieldValue(fields?.category);
        const authors = getFieldValue(fields?.authors);

        console.log(`Processing blog page webhook for slug: ${slug}`);

        // Revalidate article
        await fetch(
          `${baseUrl}/api/revalidate/article?secret=${revalidationSecret}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: slug,
              categorySlug:
                categories?.[0]?.fields?.slug || categories?.[0]?.sys?.id,
              authorId: authors?.[0]?.sys?.id,
            }),
          },
        );
        break;

      case "author":
        console.log(`Processing author webhook for ID: ${sys.id}`);
        // Revalidate author
        await fetch(
          `${baseUrl}/api/revalidate/author?secret=${revalidationSecret}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              authorId: sys.id,
            }),
          },
        );
        break;

      case "blogCategory":
        const categorySlug = getFieldValue(fields?.slug);
        console.log(`Processing category webhook for slug: ${categorySlug}`);

        // Revalidate category
        await fetch(
          `${baseUrl}/api/revalidate/category?secret=${revalidationSecret}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: categorySlug,
            }),
          },
        );
        break;

      default:
        console.log(`Unknown content type: ${contentType}, skipping...`);
        return res.json({ success: true, message: "Content type not handled" });
    }

    console.log(
      `Successfully processed webhook for content type: ${contentType}`,
    );
    return res.json({
      success: true,
      contentType,
      entryId: sys.id,
      topic: req.headers["x-contentful-topic"],
    });
  } catch (error) {
    console.error("Webhook error:", error);
    console.error("Request body:", JSON.stringify(req.body, null, 2));
    console.error("Request headers:", JSON.stringify(req.headers, null, 2));
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
