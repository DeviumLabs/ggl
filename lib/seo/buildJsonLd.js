export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GGL Móveis de Aço",
    url: "https://www.gglmoveis.com.br",
    logo: "https://www.gglmoveis.com.br/logo.svg",
    description: "Fabricante de móveis de aço para ambientes corporativos, industriais e institucionais. Qualidade, durabilidade e acabamento superior.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-42-3025-2200",
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: "Portuguese"
    },
    sameAs: ["https://www.instagram.com/gglmoveisdeaco/"]
  };
}

export function itemListJsonLd({ name, items }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      url: it.url
    }))
  };
}

export function videoListJsonLd({ name, items }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((v, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "VideoObject",
        name: v.name,
        description: v.description || `Vídeo institucional da GGL Móveis de Aço: ${v.name}.`,
        thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
        publisher: { "@type": "Organization", name: "GGL Móveis de Aço" }
      }
    }))
  };
}

export function productJsonLd({ name, description, images, sku, url, categoryName }) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images,
    sku,
    brand: { "@type": "Brand", name: "GGL Móveis de Aço" },
    url
  };
  if (categoryName) payload.category = categoryName;
  return payload;
}
