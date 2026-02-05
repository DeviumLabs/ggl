import { catalogs } from "../../lib/catalog";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Max-Age", "86400");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=59");

  const category = String(req.query.category || "");
  const product = String(req.query.product || "");

  if (category === "all") return res.status(200).json(catalogs);

  const catalog = catalogs.find((c) => c.slug === category);
  if (!catalog) return res.status(404).json({ error: "Category not found" });

  if (!product) return res.status(200).json(catalog);

  const found = (catalog.products || []).find((p) => p.slug === product) || null;
  if (!found) return res.status(404).json({ error: "Product not found" });

  return res.status(200).json(found);
}
