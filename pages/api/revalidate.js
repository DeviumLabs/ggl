import { isBlogEnabled } from "../../lib/flags";

export default async function handler(req, res) {
  if (!isBlogEnabled()) {
    return res.status(404).json({ error: "not found" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const secret = req.headers["x-revalidate-secret"];
  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const { slug } = req.body;

  try {
    await res.revalidate("/blog");
    if (slug) await res.revalidate(`/blog/${slug}`);
    return res.json({ revalidated: true, slug });
  } catch (err) {
    return res.status(500).json({ error: "revalidation failed", detail: err.message });
  }
}
