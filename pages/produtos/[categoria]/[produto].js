import React, { useState, useEffect, useMemo } from "react";
import api from "../../../services/api";
import Head from "next/head";
import Image from "next/image";
import Header from "../../../components/header";
import ContactForm from "../../../components/contact/ContactForm";
import Navbar from "../../../components/navbar";
import ZoomLens from "../../../components/zoom-lens";

export async function getServerSideProps(context) {
  const categoria = String(context.params?.categoria || "");
  const produto = String(context.params?.produto || "");

  try {
    const [resProduct, resCategories] = await Promise.all([
      api.get(`/products?category=${categoria}&product=${produto}`),
      api.get(`/category?category=all`)
    ]);

    const productData = resProduct?.data || null;
    const categoriesData = resCategories?.data || null;

    if (!productData || productData?.error) return { notFound: true };
    if (!categoriesData?.categoryArray?.length) return { notFound: true };

    return {
      props: {
        product: productData,
        categories: categoriesData,
        categoria
      }
    };
  } catch (e) {
    return { notFound: true };
  }
}

export default function SingleProduct({ product, categories, categoria }) {
  const cat = useMemo(() => {
    const list = categories?.categoryArray || [];
    return list.find((c) => c?.slug === categoria) || list[0] || null;
  }, [categories, categoria]);

  const images = useMemo(
    () =>
      Array.isArray(product?.images) && product.images.length
        ? product.images
        : ["/assets/placeholder.png"],
    [product]
  );

  const models = useMemo(
    () =>
      Array.isArray(product?.models) && product.models.length
        ? product.models
        : [{ name: product?.name || "Modelo", scale: { height: "-", width: "-", depth: "-" } }],
    [product]
  );

  const [principalImage, setPrincipalImage] = useState(images[0]);
  const [titlePrincipal, setTitlePrincipal] = useState(models[0]?.name || product?.name || "");
  const [contactMessage, setContactMessage] = useState("");
  const [table, setTable] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showAllModels, setShowAllModels] = useState(false);

  const activeVariantIndex = hoveredIndex ?? table;
  const activeVariantImage = images[activeVariantIndex] || principalImage;
  const activeVariantTitle = models[activeVariantIndex]?.name || titlePrincipal;

  const hasManyModels = models.length > 4;
  const mobileModelEntries = useMemo(() => {
    const entries = models.map((model, index) => ({ model, index }));
    if (!hasManyModels || showAllModels) return entries;

    const collapsed = entries.slice(0, 4);
    if (table >= 4 && entries[table]) collapsed.push(entries[table]);
    return collapsed;
  }, [models, hasManyModels, showAllModels, table]);

  useEffect(() => {
    setPrincipalImage(images[0]);
    setTitlePrincipal(models[0]?.name || product?.name || "");
    setTable(0);
    setHoveredIndex(null);
    setShowAllModels(false);
  }, [images, models, product?.name]);

  useEffect(() => {
    if (!product?.slug || !cat || typeof window === "undefined") return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "view_item",
      items: [
        {
          item_id: product.slug,
          item_name: `${cat.singleName || ""} ${product.name}`.trim(),
          item_category: cat.name,
          item_category2: cat.slug,
          item_variant: titlePrincipal
        }
      ],
      location: "product_page"
    });
  }, [product?.slug, product?.name, cat, titlePrincipal]);

  const createBudget = () => {
    setContactMessage(
      `Gostaria de ter mais informações sobre o produto ${cat?.singleName || ""} ${product.name}`.trim()
    );

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "request_quote_click",
        item_id: product.slug,
        item_name: `${cat?.singleName || ""} ${product.name}`.trim(),
        item_category: cat?.name,
        item_category2: cat?.slug,
        item_variant: titlePrincipal,
        location: "product_page"
      });
    }

    window.location.assign("#contato");
  };

  const selectThumbnail = (index) => {
    const image = images[index];
    if (!image) return;

    setPrincipalImage(image);
    setTable(index);
    setHoveredIndex(null);
    if (models[index]) setTitlePrincipal(models[index].name);

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "select_item",
        item_list_name: "product_thumbnails",
        items: [
          {
            item_id: product.slug,
            item_name: `${cat?.singleName || ""} ${product.name}`.trim(),
            item_category: cat?.name,
            item_category2: cat?.slug,
            item_variant: models[index]?.name || `variante_${index + 1}`,
            index: index + 1
          }
        ],
        location: "product_page"
      });
    }
  };

  const canonical = `https://www.gglmoveis.com.br/produtos/${cat?.slug || categoria}/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${cat?.singleName || ""} ${product.name}`.trim(),
    image: images,
    description:
      product.description ||
      cat?.description ||
      "Produto em aço de alta durabilidade e resistência.",
    sku: product.slug,
    brand: { "@type": "Brand", name: "GGL Móveis de Aço" },
    offers: {
      "@type": "Offer",
      url: canonical,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      priceCurrency: "BRL",
      price: "0.00"
    }
  };

  return (
    <div>
      <Head>
        <title>
          GGL Móveis de Aço | {cat?.name} - {product.name}
        </title>
        <meta
          name="description"
          content={
            product.description ||
            cat?.description ||
            "Conheça os móveis de aço da GGL: qualidade, durabilidade e acabamento superior."
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <Header />

      <main className="tw-mt-[140px] tw-mb-[100px] tw-relative">
        <Navbar categories={categories?.categoryArray || []} />

        <section className="tw-flex tw-mb-[130px] tw-justify-between tw-flex-col xl:tw-flex-row tw-w-full md:tw-w-[85%] md:tw-ml-[15%] tw-px-[20px] tw-pt-[20px] md:tw-pt-0 tw-gap-[28px]">
          <div className="tw-flex tw-w-full tw-max-w-[620px] tw-flex-col tw-items-center tw-gap-[14px] [@media(min-width:1280px)_and_(max-height:820px)]:tw-flex-row [@media(min-width:1280px)_and_(max-height:820px)]:tw-items-start [@media(min-width:1280px)_and_(max-height:820px)]:tw-gap-[10px] [@media(min-width:1280px)_and_(max-height:820px)]:tw-max-w-[640px]">
            <div className="tw-w-full tw-max-w-[520px] [@media(min-width:1280px)_and_(max-height:820px)]:tw-flex-1 [@media(min-width:1280px)_and_(max-height:820px)]:tw-min-w-0">
              <div className="md:tw-hidden tw-relative tw-w-full tw-aspect-[4/3] tw-overflow-hidden tw-rounded-[12px] tw-border tw-border-slate-200 tw-bg-white">
                <Image
                  src={activeVariantImage}
                  alt={`${product.name} - principal`}
                  fill
                  sizes="100vw"
                  className="tw-object-contain tw-object-center tw-p-[10px]"
                  priority={false}
                />
              </div>

              <div className="tw-hidden md:tw-block tw-rounded-[12px] tw-border tw-border-slate-200 tw-bg-white tw-p-[8px]">
                <ZoomLens
                  key={activeVariantImage}
                  src={activeVariantImage}
                  width={520}
                  height={450}
                  zoom={2}
                  item_id={product.slug}
                  item_name={`${cat?.singleName || ""} ${product.name}`.trim()}
                  item_category={cat?.name}
                  item_category2={cat?.slug}
                />
              </div>
            </div>

            {images.length > 1 ? (
              <div className="tw-w-full tw-max-w-[520px] tw-rounded-[12px] tw-border tw-border-slate-200 tw-bg-white tw-p-[10px] [@media(min-width:1280px)_and_(max-height:820px)]:-tw-order-1 [@media(min-width:1280px)_and_(max-height:820px)]:tw-w-[100px] [@media(min-width:1280px)_and_(max-height:820px)]:tw-min-w-[100px] [@media(min-width:1280px)_and_(max-height:820px)]:tw-max-w-[100px]">
                <div className="tw-mb-[10px] tw-flex tw-items-center tw-justify-between tw-gap-[8px] [@media(min-width:1280px)_and_(max-height:820px)]:tw-flex-col [@media(min-width:1280px)_and_(max-height:820px)]:tw-items-start [@media(min-width:1280px)_and_(max-height:820px)]:tw-gap-[4px]">
                  <p className="tw-text-[13px] tw-font-semibold tw-text-slate-700 [@media(min-width:1280px)_and_(max-height:820px)]:tw-text-[11px] [@media(min-width:1280px)_and_(max-height:820px)]:tw-leading-[1.1] [@media(min-width:1280px)_and_(max-height:820px)]:tw-whitespace-normal">
                    Fotos e variantes
                  </p>
                  <span className="tw-text-[12px] tw-text-slate-500">{images.length} opções</span>
                </div>

                <div
                  className="tw-flex tw-w-full tw-flex-wrap tw-gap-[10px] tw-pb-[2px] [@media(min-width:1280px)_and_(max-height:820px)]:tw-flex-nowrap [@media(min-width:1280px)_and_(max-height:820px)]:tw-flex-col [@media(min-width:1280px)_and_(max-height:820px)]:tw-gap-[14px]"
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {images.map((image, i) => {
                    const isActiveThumb = activeVariantIndex === i;
                    return (
                      <button
                        type="button"
                        key={`${image}-${i}`}
                        onClick={() => selectThumbnail(i)}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onFocus={() => setHoveredIndex(i)}
                        aria-label={`Ver imagem ${i + 1} de ${images.length}`}
                        aria-pressed={isActiveThumb}
                        className={[
                          "tw-relative tw-flex tw-h-[102px] tw-w-[90px] tw-shrink-0 tw-items-center tw-justify-center tw-rounded-[10px] tw-border tw-bg-white tw-transition",
                          "[@media(min-width:1280px)_and_(max-height:820px)]:tw-h-[88px] [@media(min-width:1280px)_and_(max-height:820px)]:tw-w-[88px]",
                          "focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-blue focus-visible:tw-ring-offset-2",
                          isActiveThumb
                            ? "tw-overflow-visible tw-z-[5] tw-border-blue tw-shadow-[0_0_0_1px_rgba(0,88,194,0.25)]"
                            : "tw-overflow-hidden tw-border-slate-200 hover:tw-border-blue/60"
                        ].join(" ")}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - ${i + 1}`}
                          width={92}
                          height={92}
                          sizes="(min-width: 1280px) and (max-height: 820px) 84px, 92px"
                          className={[
                            "tw-object-contain tw-pointer-events-none tw-transition-transform tw-w-[92px] tw-h-[92px]",
                            "[@media(min-width:1280px)_and_(max-height:820px)]:tw-w-[84px] [@media(min-width:1280px)_and_(max-height:820px)]:tw-h-[84px]",
                            isActiveThumb
                              ? "tw-scale-[1.18] [@media(min-width:1280px)_and_(max-height:820px)]:tw-scale-[1.12]"
                              : "tw-scale-[1.12] [@media(min-width:1280px)_and_(max-height:820px)]:tw-scale-[1.08]"
                          ].join(" ")}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className="tw-w-full xl:tw-flex-1 xl:tw-max-w-[560px] tw-mt-[14px] xl:tw-mt-0">
            <h1 className="tw-text-[38px]">{activeVariantTitle}</h1>
            <p>{product.description}</p>

            <h2 className="tw-text-[32px] tw-mt-[44px]">Medidas</h2>

            <div className="md:tw-hidden tw-mt-[14px] tw-flex tw-flex-col tw-gap-[10px]">
              {mobileModelEntries.map(({ model, index }) => {
                const isHighlighted = images.length === 1 || index === activeVariantIndex || product?.allBold;
                const hasLinkedImage = images.length > 1 && Boolean(images[index]);
                return (
                  <article
                    key={`${model.name}-${index}`}
                    onClick={() => {
                      if (hasLinkedImage) selectThumbnail(index);
                    }}
                    className={[
                      "tw-rounded-[12px] tw-border tw-bg-white tw-p-[12px]",
                      isHighlighted ? "tw-border-blue tw-bg-blue/5" : "tw-border-slate-200",
                      hasLinkedImage ? "tw-cursor-pointer hover:tw-bg-slate-50" : ""
                    ].join(" ")}
                  >
                    <div className="tw-flex tw-items-center tw-justify-between tw-gap-[8px]">
                      <h3 className="tw-text-[16px] tw-leading-[1.2] tw-text-darkBlue">{model.name}</h3>
                      {isHighlighted ? <span className="tw-text-[12px] tw-font-semibold tw-text-blue">Selecionado</span> : null}
                    </div>

                    <dl className="tw-mt-[10px] tw-grid tw-grid-cols-1 tw-gap-[6px] tw-text-[14px]">
                      <div className="tw-flex tw-items-center tw-justify-between tw-gap-[10px]">
                        <dt className="tw-text-slate-500">Altura</dt>
                        <dd className="tw-font-medium tw-text-darkBlue">{model.scale?.height ?? "-"}</dd>
                      </div>
                      <div className="tw-flex tw-items-center tw-justify-between tw-gap-[10px]">
                        <dt className="tw-text-slate-500">Largura</dt>
                        <dd className="tw-font-medium tw-text-darkBlue">{model.scale?.width ?? "-"}</dd>
                      </div>
                      <div className="tw-flex tw-items-center tw-justify-between tw-gap-[10px]">
                        <dt className="tw-text-slate-500">Profundidade</dt>
                        <dd className="tw-font-medium tw-text-darkBlue">{model.scale?.depth ?? "-"}</dd>
                      </div>
                    </dl>
                  </article>
                );
              })}

              {hasManyModels ? (
                <button
                  type="button"
                  onClick={() => setShowAllModels((prev) => !prev)}
                  className="tw-self-start tw-text-blue tw-font-medium hover:tw-underline"
                >
                  {showAllModels ? "Mostrar menos modelos" : "Mostrar mais modelos"}
                </button>
              ) : null}
            </div>

            <div className="tw-hidden md:tw-block tw-mt-[14px] tw-w-full tw-rounded-[12px] tw-border tw-border-slate-300">
              <div className="tw-w-full tw-overflow-x-auto">
                <table className="tw-w-full tw-table-fixed tw-border-collapse tw-text-[14px] lg:tw-text-[15px]">
                  <colgroup>
                    <col className="tw-w-[34%]" />
                    <col className="tw-w-[22%]" />
                    <col className="tw-w-[22%]" />
                    <col className="tw-w-[22%]" />
                  </colgroup>
                  <thead className="tw-bg-slate-100">
                    <tr>
                      <th className="tw-text-left tw-border tw-border-slate-300 tw-py-[8px] tw-px-[10px] tw-font-semibold tw-whitespace-normal tw-break-words">Modelo</th>
                      <th className="tw-text-left tw-border tw-border-slate-300 tw-py-[8px] tw-px-[10px] tw-font-semibold tw-whitespace-normal tw-break-words">Altura</th>
                      <th className="tw-text-left tw-border tw-border-slate-300 tw-py-[8px] tw-px-[10px] tw-font-semibold tw-whitespace-normal tw-break-words">Largura</th>
                      <th className="tw-text-left tw-border tw-border-slate-300 tw-py-[8px] tw-px-[10px] tw-font-semibold tw-whitespace-normal tw-break-words">Profundidade</th>
                    </tr>
                  </thead>
                  <tbody onMouseLeave={() => setHoveredIndex(null)}>
                  {models.map((model, i) => {
                    const isHighlighted = images.length === 1 || i === activeVariantIndex || product?.allBold;
                    const hasLinkedImage = images.length > 1 && Boolean(images[i]);
                    return (
                      <tr
                        key={`${model.name}-${i}`}
                        onMouseEnter={() => {
                          if (hasLinkedImage) setHoveredIndex(i);
                        }}
                        onClick={() => {
                          if (hasLinkedImage) selectThumbnail(i);
                        }}
                        className={[
                          isHighlighted ? "tw-bg-blue/5 tw-font-semibold" : "tw-font-light",
                          hasLinkedImage ? "tw-cursor-pointer hover:tw-bg-slate-50" : ""
                        ].join(" ")}
                      >
                          <td className="tw-border tw-border-slate-300 tw-py-[8px] tw-px-[10px] tw-whitespace-normal tw-break-words tw-leading-[1.25]">{model.name}</td>
                          <td className="tw-border tw-border-slate-300 tw-py-[8px] tw-px-[10px] tw-whitespace-normal tw-break-words tw-leading-[1.25]">{model.scale?.height ?? "-"}</td>
                          <td className="tw-border tw-border-slate-300 tw-py-[8px] tw-px-[10px] tw-whitespace-normal tw-break-words tw-leading-[1.25]">{model.scale?.width ?? "-"}</td>
                          <td className="tw-border tw-border-slate-300 tw-py-[8px] tw-px-[10px] tw-whitespace-normal tw-break-words tw-leading-[1.25]">{model.scale?.depth ?? "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="button"
              className="tw-bg-blue tw-mt-[30px] tw-text-white tw-w-[240px] tw-h-[50px] hover:tw-bg-white hover:tw-border-blue hover:tw-border-[1px] hover:tw-text-blue tw-transition-300"
              onClick={createBudget}
            >
              Fazer Orçamento
            </button>
          </div>
        </section>

        <ContactForm budgetMessage={contactMessage} />
      </main>
    </div>
  );
}
