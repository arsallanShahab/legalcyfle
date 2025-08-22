import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (req.body.secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: "Invalid revalidation secret" });
  }

  try {
    const { slug } = req.body;

    if (!slug) {
      return res.status(400).json({ message: "Category slug is required" });
    }

    console.log(`Revalidating category: ${slug}`);

    // Revalidate the main category page
    await res.revalidate(`/category/${slug}`);

    // Revalidate paginated category pages
    try {
      await res.revalidate(`/category/${slug}/1`);
      await res.revalidate(`/category/${slug}/2`);
      await res.revalidate(`/category/${slug}/3`);
      await res.revalidate(`/category/${slug}/4`);
      await res.revalidate(`/category/${slug}/5`);
    } catch (err) {
      console.log("Some category pages do not exist, skipping...");
    }

    // Revalidate homepage as it might show category-related content
    await res.revalidate("/");

    console.log(`Successfully revalidated category: ${slug}`);
    return res.json({ revalidated: true, slug });
  } catch (err) {
    console.error("Error revalidating category:", err);
    return res.status(500).send("Error revalidating");
  }
}
