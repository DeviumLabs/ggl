import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "..");
const outFile = path.join(root, "public", "sitemap.xml");

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gglmoveis.com.br";

const { getAllCategorySlugs, getAllProductRoutes } = await import(path.join(root, "lib", "catalog", "index.js"));

const urls = [];

urls.push({ loc: `${siteUrl}/`, changefreq: "monthly", priority: "1.0" });
urls.push({ loc: `${siteUrl}/produtos`, changefreq: "monthly", priority: "0.9" });
urls.push({ loc: `${siteUrl}/videos`, changefreq: "monthly", priority: "0.6" });

for (const slug of getAllCategorySlugs()) {
  urls.push({ loc: `${siteUrl}/produtos/${slug}`, changefreq: "monthly", priority: "0.8" });
}

for (const { categoria, produto } of getAllProductRoutes()) {
  urls.push({ loc: `${siteUrl}/produtos/${categoria}/${produto}`, changefreq: "yearly", priority: "0.7" });
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((u) => {
      return (
        `  <url>` +
        `<loc>${u.loc}</loc>` +
        `<changefreq>${u.changefreq}</changefreq>` +
        `<priority>${u.priority}</priority>` +
        `</url>\n`
      );
    })
    .join("") +
  `</urlset>\n`;

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, xml, "utf8");
