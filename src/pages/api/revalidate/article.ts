import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { secret, slug, categorySlug, authorId } = req.body;

    if (secret !== process.env.REVALIDATION_SECRET) {
      return res.status(401).json({ message: "Invalid revalidation secret" });
    }

    if (!slug) {
      return res.status(400).json({ message: "Article slug is required" });
    }

    console.log(`Revalidating article: ${slug}`);

    // Revalidate the main article page
    await res.revalidate(`/${slug}`);

    // Revalidate category pages if category is provided
    if (categorySlug) {
      console.log(`Revalidating category: ${categorySlug}`);
      await res.revalidate(`/category/${categorySlug}`);

      try {
        await res.revalidate(`/category/${categorySlug}/1`);
        await res.revalidate(`/category/${categorySlug}/2`);
      } catch (err) {
        console.log("Some category pages do not exist, skipping...");
      }
    }

    // Revalidate author pages if author is provided
    if (authorId) {
      console.log(`Revalidating author: ${authorId}`);
      await res.revalidate(`/author/${authorId}`);

      try {
        await res.revalidate(`/author/${authorId}/1`);
        await res.revalidate(`/author/${authorId}/2`);
      } catch (err) {
        console.log("Some author pages do not exist, skipping...");
      }
    }

    // Revalidate homepage
    await res.revalidate("/");

    console.log(`Successfully revalidated article: ${slug}`);
    return res.json({
      revalidated: true,
      slug,
      categorySlug: categorySlug || null,
      authorId: authorId || null,
    });
  } catch (err) {
    console.error("Error revalidating article:", err);
    return res.status(500).send("Error revalidating");
  }
}
