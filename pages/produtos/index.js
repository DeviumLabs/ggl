import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import SeoHead from "../../components/layout/SeoHead";
import ContactForm from "../../components/contact/ContactForm";
import Reveal from "../../components/animations/Reveal";
import { categories } from "../../lib/catalog";
import { breadcrumbJsonLd, itemListJsonLd } from "../../lib/seo/buildJsonLd";
import { trackSelectItem, trackViewItemList } from "../../lib/analytics/events";

export async function getStaticProps() {
  return { props: { categories }, revalidate: 300 };
}

export default function Produtos({ categories }) {
  useEffect(() => {
    const list = categories || [];
    if (!list.length) return;

    trackViewItemList({
      location: "products_list_page",
      item_list_name: "Produtos - categorias",
      items: list.map((cat, index) => ({
        item_id: cat.slug,
        item_name: cat.name,
        index: index + 1
      }))
    });
  }, [categories]);

  const listJsonLd = itemListJsonLd({
    name: "Produtos por categoria",
    items: (categories || []).map((cat) => ({
      name: cat.name,
      url: `https://www.gglmoveis.com.br/produtos/${cat.slug}`
    }))
  });
  const breadcrumbJson = breadcrumbJsonLd({
    items: [
      { name: "Home", url: "https://www.gglmoveis.com.br/" },
      { name: "Produtos", url: "https://www.gglmoveis.com.br/produtos" }
    ]
  });
  const jsonLd = [listJsonLd, breadcrumbJson];

  const onCategoryClick = (cat, index) =>
    trackSelectItem({
      item_list_name: "Produtos - categorias",
      items: [{ item_id: cat.slug, item_name: cat.name, index: index + 1 }],
      location: "products_list_page"
    });

  const isSvg = (src) => typeof src === "string" && /\.svg(\?.*)?$/i.test(src);
  const toAbsoluteUrl = (src) => (typeof src === "string" && src.startsWith("http") ? src : `https://www.gglmoveis.com.br${src || ""}`);
  const firstCategoryImage = toAbsoluteUrl((categories || [])[0]?.image || "/assets/banners/uepg-banner1.png");

  const categoryAccents = [
    "tw-from-blue/20 tw-via-sky-100/75 tw-to-cyan-100/65",
    "tw-from-slate-100 tw-via-blue-100/65 tw-to-indigo-100/70",
    "tw-from-cyan-100/70 tw-via-sky-100/70 tw-to-blue-100/65",
    "tw-from-blue-100/75 tw-via-slate-100 tw-to-sky-100/70"
  ];

  return (
    <div>
      <SeoHead
        title="Produtos por Categoria | GGL Móveis de Aço"
        description="Confira a linha completa de móveis de aço GGL por categoria e encontre soluções para armazenagem, organização e operação."
        canonical="https://www.gglmoveis.com.br/produtos"
        image={firstCategoryImage}
        jsonLd={jsonLd}
      />

      <main className="tw-pt-[110px] tw-max-w-[1920px] tw-mx-auto tw-overflow-hidden tw-bg-[radial-gradient(circle_at_18%_20%,rgba(191,219,254,0.40),transparent_46%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.16),transparent_44%),linear-gradient(180deg,#f8fafc_0%,#ffffff_56%,#f8fafc_100%)]">
        <section className="tw-px-[20px] tw-pt-[38px] tw-pb-[26px]">
          <Reveal direction="up">
            <div className="tw-max-w-[1240px] tw-mx-auto tw-rounded-[34px] tw-border tw-border-slate-200/70 tw-bg-white/80 tw-backdrop-blur-sm tw-p-[22px] md:tw-p-[30px] tw-shadow-[0_22px_38px_-30px_rgba(15,23,42,0.65)]">
              <small className="tw-text-blue tw-font-semibold tw-tracking-[0.08em]">LINHA DE PRODUTOS</small>
              <h1 className="tw-text-[32px] md:tw-text-[42px] tw-leading-[1.08] tw-text-darkBlue tw-mt-[8px]">
                Categorias para organizar operação, armazenagem e fluxo
              </h1>
              <p className="tw-mt-[12px] tw-max-w-[820px] tw-text-[16px] tw-text-slate-600">
                Explore as categorias da GGL para encontrar móveis de aço com estrutura robusta, acabamento profissional e aplicação em diferentes ambientes.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="tw-px-[20px] tw-pb-[92px]">
          <div className="tw-max-w-[1240px] tw-mx-auto tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-[18px]">
            {(categories || []).map((category, idx) => {
              const firstProductSlug = category?.products?.[0]?.slug;
              const href = firstProductSlug
                ? `/produtos/${category.slug}/${firstProductSlug}`
                : `/produtos/${category.slug}`;
              const img = category.image;
              const accent = categoryAccents[idx % categoryAccents.length];
              const totalModels = Array.isArray(category.products) ? category.products.length : 0;

              return (
                <Reveal key={category.slug} direction="up" delay={Math.min(idx * 70, 280)}>
                  <Link
                    href={href}
                    className="tw-group tw-block tw-w-full tw-relative tw-isolate tw-overflow-hidden tw-rounded-[30px] tw-border tw-border-slate-200/80 tw-bg-white tw-p-[14px] tw-shadow-[0_16px_30px_-24px_rgba(15,23,42,0.62)] tw-transition-all tw-duration-300 hover:-tw-translate-y-[4px] hover:tw-shadow-[0_24px_38px_-22px_rgba(15,23,42,0.5)]"
                    onClick={() => onCategoryClick(category, idx)}
                  >
                    <div
                      className={`tw-absolute tw-z-[1] tw-inset-[1px] tw-rounded-[28px] tw-bg-gradient-to-br ${accent} tw-opacity-75 tw-pointer-events-none`}
                      aria-hidden="true"
                    />
                    <div className="tw-relative tw-z-[2]">
                      <div className="tw-h-[210px] tw-w-full tw-rounded-[22px] tw-overflow-hidden tw-bg-white/92 tw-flex tw-items-center tw-justify-center">
                        {isSvg(img) ? (
                          <img
                            src={img}
                            alt={`Imagem da categoria ${category.name} da GGL Móveis de Aço`}
                            width={220}
                            height={180}
                            loading="lazy"
                            decoding="async"
                            style={{ width: "220px", height: "180px", objectFit: "contain" }}
                          />
                        ) : (
                          <Image
                            src={img}
                            alt={`Imagem da categoria ${category.name} da GGL Móveis de Aço`}
                            width={220}
                            height={180}
                            sizes="(max-width: 768px) 85vw, 220px"
                            style={{ width: "220px", height: "180px", objectFit: "contain" }}
                          />
                        )}
                      </div>

                      <div className="tw-mt-[14px] tw-flex tw-items-start tw-justify-between tw-gap-[12px]">
                        <div>
                          <h2 className="tw-text-[21px] tw-leading-[1.15] tw-font-semibold tw-text-darkBlue">{category.name}</h2>
                          <p className="tw-mt-[7px] tw-text-[14px] tw-text-slate-600">{category.description}</p>
                        </div>
                        <span
                          aria-hidden="true"
                          className="tw-inline-flex tw-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-w-[30px] tw-h-[30px] tw-bg-white/95 tw-text-blue tw-transition-transform group-hover:tw-translate-x-[2px]"
                        >
                          →
                        </span>
                      </div>

                      <div className="tw-mt-[11px] tw-inline-flex tw-items-center tw-rounded-full tw-bg-white/75 tw-text-blue tw-font-medium tw-text-[12px] tw-px-[10px] tw-py-[4px]">
                        {totalModels} {totalModels === 1 ? "modelo" : "modelos"}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
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
