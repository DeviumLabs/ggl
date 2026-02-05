import { categories } from "./categories";
import { catalogs } from "./catalogs";

export { categories, catalogs };

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug) || null;
}

export function getCatalogByCategorySlug(slug) {
  return catalogs.find((c) => c.slug === slug) || null;
}

export function getProductBySlugs(categoria, produto) {
  const catalog = getCatalogByCategorySlug(categoria);
  if (!catalog) return null;
  const product = (catalog.products || []).find((p) => p.slug === produto) || null;
  return product;
}

export function getAllCategorySlugs() {
  return categories.map((c) => c.slug);
}

export function getAllProductPaths() {
  const paths = [];
  for (const cat of categories) {
    for (const p of cat.products || []) {
      paths.push({ params: { categoria: cat.slug, produto: p.slug } });
    }
  }
  return paths;
}
