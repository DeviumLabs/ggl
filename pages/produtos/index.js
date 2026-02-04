import api from "../../services/api";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Contact from "../../components/contact";
import { useEffect } from "react";

export async function getStaticProps() {
  const res = await api.get("/category?category=all");
  return {
    props: { categories: res.data },
    revalidate: 5,
  };
}

export default function Produtos({ categories }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const list = categories?.categoryArray || [];
    if (!list.length) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "view_item_list",
      location: "products_list_page",
      item_list_name: "Produtos - categorias",
      items: list.map((cat, index) => ({
        item_id: cat.slug,
        item_name: cat.name,
        index: index + 1,
      })),
    });
  }, [categories]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: (categories?.categoryArray || []).map((cat, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: cat.name,
      url: `https://www.gglmoveis.com.br/produtos/${cat.slug}?product=${cat.products[0].slug}`,
    })),
  };

  const onCategoryClick = (cat, index) => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "select_item",
      item_list_name: "Produtos - categorias",
      items: [
        {
          item_id: cat.slug,
          item_name: cat.name,
          index: index + 1,
        },
      ],
      location: "products_list_page",
    });
  };

  const list = categories?.categoryArray || [];
  const isSvg = (src) => typeof src === "string" && /\.svg(\?.*)?$/i.test(src);

  return (
    <div>
      <Head>
        <title>GGL Móveis de Aço | Todos os Produtos por Categoria</title>
        <meta
          name="description"
          content="Confira a linha completa de móveis de aço GGL por categoria: armários, estantes, arquivos, gondolas, porta-pallets e muito mais. Qualidade e resistência para empresas."
        />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/logo.png" />
        <link rel="canonical" href="https://www.gglmoveis.com.br/produtos" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Header />

      <main className="tw-mt-[120px]">
        <section className="tw-px-[20px] tw-flex-col md:tw-flex-row tw-flex tw-items-center">
          <div className="tw-w-full">
            <h1 className="tw-text-[35px] tw-mb-[10px] tw-text-center">PRODUTOS</h1>
            <p className="tw-text-center">
              Produtos da mais excelente qualidade para sua empresa.
            </p>
          </div>
        </section>

        <section className="tw-px-[20px] tw-flex tw-justify-center tw-flex-wrap tw-gap-y-[80px] tw-gap-x-[40px] tw-mt-[80px] tw-mb-[100px]">
          {list.map((category, idx) => {
            const href = `/produtos/${category.slug}?product=${category.products[0].slug}`;
            const img = category.image;

            return (
              <Link
                key={category.slug}
                href={href}
                className="tw-max-w-[350px] tw-w-full tw-transition-transform tw-duration-300 hover:tw-scale-105"
                onClick={() => onCategoryClick(category, idx)}
              >
                <div className="tw-w-full tw-h-[300px] tw-flex tw-items-center tw-justify-center">
                  {isSvg(img) ? (
                    <img
                      src={img}
                      alt={`Imagem da categoria ${category.name} da GGL Móveis de Aço`}
                      width={350}
                      height={300}
                      loading="lazy"
                      decoding="async"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <Image
                      src={img}
                      alt={`Imagem da categoria ${category.name} da GGL Móveis de Aço`}
                      width={350}
                      height={300}
                      sizes="(max-width: 768px) 90vw, 350px"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  )}
                </div>

                <div className="tw-mt-[20px]">
                  <h1 className="tw-text-[22px]">{category.name}</h1>
                  <p>{category.description}</p>
                </div>
              </Link>
            );
          })}
        </section>

        <Contact />
      </main>

      <Footer />
    </div>
  );
}
