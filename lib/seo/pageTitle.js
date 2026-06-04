/** Título de página de produto — sempre string plana (evita <!-- --> no <title> do React). */
export function productPageTitle(categoryName, productName) {
  const cat = String(categoryName ?? "").trim();
  const prod = String(productName ?? "").trim();
  if (cat && prod) return `GGL Móveis de Aço | ${cat} - ${prod}`;
  if (prod) return `${prod} | GGL Móveis de Aço`;
  if (cat) return `${cat} | GGL Móveis de Aço`;
  return "GGL Móveis de Aço";
}
