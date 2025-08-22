import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.query.secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    // Revalidate homepage
    await res.revalidate("/");

    console.log(`Successfully revalidated homepage`);
    return res.json({
      revalidated: true,
    });
  } catch (err) {
    console.error("Error revalidating homepage:", err);
    return res.status(500).send("Error revalidating");
  }
}
