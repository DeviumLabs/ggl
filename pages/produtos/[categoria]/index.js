import Link from "next/link";
import Image from "next/image";
import SeoHead from "../../../components/layout/SeoHead";
import ContactForm from "../../../components/contact/ContactForm";
import Reveal from "../../../components/animations/Reveal";
import { getAllCategorySlugs, getCategoryBySlug, getCatalogByCategorySlug } from "../../../lib/catalog";
import { breadcrumbJsonLd, itemListJsonLd } from "../../../lib/seo/buildJsonLd";
import { useEffect } from "react";
import { trackSelectItem, trackViewItemList } from "../../../lib/analytics/events";

export async function getStaticPaths() {
  const slugs = getAllCategorySlugs();
  return {
    paths: slugs.map((categoria) => ({ params: { categoria } })),
    fallback: "blocking"
  };
}

export async function getStaticProps({ params }) {
  const categoria = params?.categoria || "";
  const category = getCategoryBySlug(categoria);
  const catalog = getCatalogByCategorySlug(categoria);

  if (!category || !catalog) return { notFound: true };

  const products = (catalog.products || []).map((p) => {
    const firstImage = Array.isArray(p.images) && p.images.length ? p.images[0] : "/assets/placeholder.png";
    return { ...p, firstImage };
  });

  return {
    props: { category, products },
    revalidate: 300
  };
}

export default function CategoryPage({ category, products }) {
  useEffect(() => {
    trackViewItemList({
      location: "category_page",
      item_list_name: `Categoria - ${category.name}`,
      items: (products || []).map((p, idx) => ({
        item_id: p.slug,
        item_name: p.name,
        item_category: category.name,
        item_category2: category.slug,
        index: idx + 1
      }))
    });
  }, [category, products]);

  const listJsonLd = itemListJsonLd({
    name: `Produtos da categoria ${category.name}`,
    items: (products || []).map((p) => ({
      name: p.name,
      url: `https://www.gglmoveis.com.br/produtos/${category.slug}/${p.slug}`
    }))
  });
  const breadcrumbJson = breadcrumbJsonLd({
    items: [
      { name: "Home", url: "https://www.gglmoveis.com.br/" },
      { name: "Produtos", url: "https://www.gglmoveis.com.br/produtos" },
      { name: category.name, url: `https://www.gglmoveis.com.br/produtos/${category.slug}` }
    ]
  });
  const jsonLd = [listJsonLd, breadcrumbJson];

  const onProductClick = (p, idx) =>
    trackSelectItem({
      location: "category_page",
      item_list_name: `Categoria - ${category.name}`,
      items: [
        {
          item_id: p.slug,
          item_name: p.name,
          item_category: category.name,
          item_category2: category.slug,
          index: idx + 1
        }
      ]
    });
  const toAbsoluteUrl = (src) => (typeof src === "string" && src.startsWith("http") ? src : `https://www.gglmoveis.com.br${src || ""}`);
  const firstProductImage = toAbsoluteUrl((products || [])[0]?.firstImage || "/assets/banners/uepg-banner1.png");
  const totalProducts = Array.isArray(products) ? products.length : 0;

  return (
    <div>
      <SeoHead
        title={`${category.name} | GGL Móveis de Aço`}
        description={category.description || `Conheça os produtos da categoria ${category.name} da GGL Móveis de Aço.`}
        canonical={`https://www.gglmoveis.com.br/produtos/${category.slug}`}
        image={firstProductImage}
        jsonLd={jsonLd}
      />

      <main className="tw-pt-[110px] tw-relative tw-max-w-[1920px] tw-mx-auto tw-overflow-hidden tw-bg-[radial-gradient(circle_at_18%_20%,rgba(191,219,254,0.40),transparent_46%),radial-gradient(circle_at_82%_12%,rgba(14,165,233,0.15),transparent_42%),linear-gradient(180deg,#f8fafc_0%,#ffffff_56%,#f8fafc_100%)]">
        <section className="tw-px-[20px] tw-pt-[36px] tw-pb-[20px]">
          <Reveal direction="up">
            <div className="tw-max-w-[1240px] tw-mx-auto tw-rounded-[32px] tw-border tw-border-slate-200/70 tw-bg-white/80 tw-backdrop-blur-sm tw-p-[22px] md:tw-p-[30px] tw-shadow-[0_22px_38px_-30px_rgba(15,23,42,0.65)]">
              <nav aria-label="Breadcrumb" className="tw-flex tw-items-center tw-gap-[7px] tw-text-[13px] tw-text-slate-500">
                <Link href="/produtos" className="hover:tw-text-blue hover:tw-underline">
                  Produtos
                </Link>
                <span aria-hidden="true">/</span>
                <span className="tw-text-slate-600">{category.name}</span>
              </nav>

              <h1 className="tw-text-[31px] md:tw-text-[40px] tw-leading-[1.08] tw-text-darkBlue tw-mt-[10px]">{category.name}</h1>
              <p className="tw-max-w-[900px] tw-mt-[10px] tw-text-[16px] tw-text-slate-600">
                {category.description || "Confira os produtos desta categoria e encontre a solução ideal para sua operação."}
              </p>

              <span className="tw-mt-[14px] tw-inline-flex tw-items-center tw-rounded-full tw-bg-blue/10 tw-text-blue tw-text-[12px] tw-font-semibold tw-px-[11px] tw-py-[5px]">
                {totalProducts} {totalProducts === 1 ? "produto" : "produtos"} na categoria
              </span>
            </div>
          </Reveal>
        </section>

        <section className="tw-px-[20px] tw-max-w-[1240px] tw-w-full tw-mx-auto tw-mt-[14px] tw-pb-[92px] tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-[18px]">
          {(products || []).map((p, idx) => {
            const description = p.description || category.description || "Confira detalhes técnicos e dimensões desta linha.";
            const itemName = category?.singleName ? `${category.singleName} ${p.name}` : p.name;

            return (
              <Reveal key={p.slug} direction="up" delay={Math.min(idx * 70, 280)}>
                <Link
                  href={`/produtos/${category.slug}/${p.slug}`}
                  className="tw-group tw-block tw-w-full tw-relative tw-isolate tw-overflow-hidden tw-rounded-[28px] tw-border tw-border-slate-200/80 tw-bg-white tw-p-[14px] tw-shadow-[0_16px_28px_-22px_rgba(15,23,42,0.58)] tw-transition-all tw-duration-300 hover:-tw-translate-y-[4px] hover:tw-shadow-[0_24px_36px_-20px_rgba(15,23,42,0.5)]"
                  onClick={() => onProductClick(p, idx)}
                >
                  <div
                    className="tw-absolute tw-z-[1] tw-inset-[1px] tw-rounded-[26px] tw-bg-gradient-to-br tw-from-blue/18 tw-via-sky-100/70 tw-to-cyan-100/65 tw-opacity-75 tw-pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="tw-relative tw-z-[2]">
                    <div className="tw-w-full tw-aspect-[4/3] tw-relative tw-overflow-hidden tw-rounded-[20px] tw-bg-white/92">
                      <Image src={p.firstImage} alt={`${itemName} - GGL Móveis de Aço`} fill sizes="(max-width: 768px) 90vw, 380px" style={{ objectFit: "contain" }} />
                    </div>

                    <h2 className="tw-text-[19px] tw-leading-[1.2] tw-font-semibold tw-text-darkBlue tw-mt-[12px]">{p.name}</h2>
                    <p className="tw-text-[14px] tw-text-slate-600 tw-mt-[6px]">{description}</p>

                    <div className="tw-mt-[12px] tw-inline-flex tw-items-center tw-gap-[8px] tw-rounded-full tw-bg-white/90 tw-text-blue tw-font-medium tw-text-[13px] tw-px-[12px] tw-py-[6px]">
                      Ver detalhes
                      <span aria-hidden="true" className="tw-transition-transform tw-duration-300 group-hover:tw-translate-x-[2px]">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </section>

        <section className="tw-px-[20px] tw-mt-[2px]">
          <Reveal direction="up">
            <ContactForm />
          </Reveal>
        </section>
      </main>
    </div>
  );
}
