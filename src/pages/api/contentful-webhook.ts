import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { sys, fields } = req.body;

    if (!sys || !sys.contentType) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    const contentType = sys.contentType.sys.id;
    const revalidationSecret = process.env.REVALIDATION_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    console.log(`Received webhook for content type: ${contentType}`);

    switch (contentType) {
      case "blogPage":
        console.log(`Processing blog page webhook for slug: ${fields?.slug}`);
        // Revalidate article
        await fetch(
          `${baseUrl}/api/revalidate/article?secret=${revalidationSecret}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: fields.slug,
              categorySlug: fields.category?.[0]?.fields?.slug,
              authorId: fields.authors?.[0]?.sys?.id,
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
        console.log(`Processing category webhook for slug: ${fields?.slug}`);
        // Revalidate category
        await fetch(
          `${baseUrl}/api/revalidate/category?secret=${revalidationSecret}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: fields.slug,
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
    return res.json({ success: true, contentType });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
