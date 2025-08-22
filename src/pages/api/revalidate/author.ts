import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { secret, authorId } = req.body;

    // Check for secret to confirm this is a valid request
    if (secret !== process.env.REVALIDATION_SECRET) {
      return res.status(401).json({ message: "Invalid revalidation secret" });
    }

    if (!authorId) {
      return res.status(400).json({ message: "Author ID is required" });
    }

    console.log(`Revalidating author pages for ID: ${authorId}`);

    // Revalidate the author page
    await res.revalidate(`/author/${authorId}`);

    // Also revalidate paginated pages if they exist
    try {
      await res.revalidate(`/author/${authorId}/1`);
      await res.revalidate(`/author/${authorId}/2`);
      await res.revalidate(`/author/${authorId}/3`);
    } catch (err) {
      // Pages might not exist, that's okay
      console.log("Some paginated author pages do not exist, skipping...");
    }

    console.log(`Successfully revalidated author pages for ID: ${authorId}`);
    return res.json({ revalidated: true, authorId });
  } catch (err) {
    console.error("Error revalidating author pages:", err);
    return res.status(500).send("Error revalidating");
  }
}
