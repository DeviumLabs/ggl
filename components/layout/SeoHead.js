import Head from "next/head";

export default function SeoHead({ title, description, canonical, image, jsonLd, robots = "index, follow" }) {
  const safeTitle = title || "GGL Móveis de Aço";
  const safeDesc = description || "Móveis de aço para empresas, indústrias, escolas e órgãos públicos. Qualidade, durabilidade e acabamento superior.";
  const safeCanonical = canonical || "https://www.gglmoveis.com.br";
  const safeImage = image || "https://www.gglmoveis.com.br/assets/banners/uepg-banner1.png";

  return (
    <Head>
      <title>{safeTitle}</title>
      <meta name="description" content={safeDesc} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={safeCanonical} />
      <meta property="og:site_name" content="GGL Móveis de Aço" />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDesc} />
      <meta property="og:url" content={safeCanonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={safeImage} />
      <meta property="og:image:alt" content={safeTitle} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={safeImage} />
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}
    </Head>
  );
}
