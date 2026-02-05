import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import SeoHead from "../../components/layout/SeoHead";
import ContactForm from "../../components/contact/ContactForm";
import { categories } from "../../lib/catalog";
import { dlPush } from "../../lib/analytics/dataLayer";
import { itemListJsonLd } from "../../lib/seo/buildJsonLd";

export async function getStaticProps() {
  return { props: { categories }, revalidate: 300 };
}

export default function Produtos({ categories }) {
  useEffect(() => {
    const list = categories || [];
    if (!list.length) return;

    dlPush("view_item_list", {
      location: "products_list_page",
      item_list_name: "Produtos - categorias",
      items: list.map((cat, index) => ({
        item_id: cat.slug,
        item_name: cat.name,
        index: index + 1
      }))
    });
  }, [categories]);

  const jsonLd = itemListJsonLd({
    name: "Produtos por categoria",
    items: (categories || []).map((cat) => ({
      name: cat.name,
      url: `https://www.gglmoveis.com.br/produtos/${cat.slug}`
    }))
  });

  const onCategoryClick = (cat, index) =>
    dlPush("select_item", {
      event: "select_item",
      item_list_name: "Produtos - categorias",
      items: [{ item_id: cat.slug, item_name: cat.name, index: index + 1 }],
      location: "products_list_page"
    });

  const isSvg = (src) => typeof src === "string" && /\.svg(\?.*)?$/i.test(src);

  return (
    <div>
      <SeoHead
        title="GGL Móveis de Aço | Todos os Produtos por Categoria"
        description="Confira a linha completa de móveis de aço GGL por categoria: armários, estantes, arquivos, gôndolas, porta-pallets e muito mais."
        canonical="https://www.gglmoveis.com.br/produtos"
        jsonLd={jsonLd}
      />

      <main className="tw-mt-[120px]">
        <section className="tw-px-[20px] tw-flex-col md:tw-flex-row tw-flex tw-items-center">
          <div className="tw-w-full">
            <h1 className="tw-text-[35px] tw-mb-[10px] tw-text-center">PRODUTOS</h1>
            <p className="tw-text-center">Produtos da mais excelente qualidade para sua empresa.</p>
          </div>
        </section>

        <section className="tw-px-[20px] tw-flex tw-justify-center tw-flex-wrap tw-gap-y-[80px] tw-gap-x-[40px] tw-mt-[80px] tw-mb-[100px]">
          {(categories || []).map((category, idx) => {
            const href = `/produtos/${category.slug}`;
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
                  <h2 className="tw-text-[22px]">{category.name}</h2>
                  <p>{category.description}</p>
                </div>
              </Link>
            );
          })}
        </section>

        <ContactForm />
      </main>
    </div>
  );
}
