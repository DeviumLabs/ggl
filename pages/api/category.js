import { categories } from "../../lib/catalog";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=59");

  const categorySelected = String(req.query.category ?? "all");

  let categoryArray = [];
  if (categorySelected === "all") categoryArray = categories;
  else if (categorySelected === "estante") {
    const group = new Set(["estantes-convencionais", "estantes-armazenagem"]);
    categoryArray = categories.filter((c) => group.has(c.category));
  } else {
    categoryArray = categories.filter((c) => c.slug === categorySelected);
  }

  return res.status(200).json({ categoryArray });
}
