import client from "@/lib/contentful";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("Fetching categories from Contentful...");

    // Check if environment variables are set
    if (
      !process.env.CONTENTFUL_SPACE_ID ||
      !process.env.CONTENTFUL_ACCESS_TOKEN
    ) {
      console.error("Missing Contentful environment variables");
      return res.status(500).json({
        success: false,
        message: "Contentful environment variables not configured",
        error: "Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN",
      });
    }

    const categories = await client.getEntries({
      content_type: "blogCategory",
      select: ["fields.slug"],
    });

    const paths = categories.items.map((category: any) => {
      const slug = category.fields.slug;
      return `/category/${slug}`;
    });

    console.log("Categories fetched successfully:", paths);

    return res.status(200).json({
      success: true,
      categories: paths,
      count: paths.length,
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories from Contentful",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
