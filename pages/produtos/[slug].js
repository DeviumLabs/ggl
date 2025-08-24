import React, { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import Head from "next/head";
import Image from "next/image";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Contact from "../../components/contact";
import Navbar from "../../components/navbar";
import ZoomLens from "../../components/zoom-lens";

export async function getServerSideProps(context) {
  const category = context.query.slug;
  const slug = context.query.product;

  const res = await api.get(`/products?category=${category}&product=${slug}`);
  const categories = await api.get(`/category?category=${category}`);

  return {
    props: {
      product: res.data || null,
      categories: categories.data || null,
    },
  };
}

export default function SingleProduct({ product, categories }) {
  const cat = useMemo(() => categories?.categoryArray?.[0] ?? null, [categories]);
  const images = useMemo(() => (Array.isArray(product?.images) && product.images.length ? product.images : ["/assets/placeholder.png"]), [product]);
  const models = useMemo(() => (Array.isArray(product?.models) && product.models.length ? product.models : [{ name: product?.name || "Modelo", scale: { height: "-", width: "-", depth: "-" } }]), [product]);

  const [principalImage, setPrincipalImage] = useState(images[0]);
  const [titlePrincipal, setTitlePrincipal] = useState(models[0]?.name || product?.name || "");
  const [contactMessage, setContactMessage] = useState("");
  const [table, setTable] = useState(0);

  useEffect(() => {
    setPrincipalImage(images[0]);
    setTitlePrincipal(models[0]?.name || product?.name || "");
    setTable(0);
  }, [images, models, product?.name]);

  useEffect(() => {
    if (!product?.slug || !cat || typeof window === "undefined") return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "view_item",
      items: [
        {
          item_id: product.slug,
          item_name: `${cat.singleName} ${product.name}`,
          item_category: cat.name,
          item_category2: cat.slug,
          item_variant: titlePrincipal,
        },
      ],
      location: "product_page",
    });
  }, [product?.slug, product?.name, cat, titlePrincipal]);

  if (!product || product?.error) {
    return (
      <div className="tw-h-[100vh] tw-flex tw-items-center tw-flex-col tw-justify-center tw-w-full">
        <h1>O Produto selecionado não existe ou possui informações incorretas!</h1>
        <p>CÓDIGO DO ERRO: 404 Not Found</p>
      </div>
    );
  }

  const createBudget = () => {
    setContactMessage(
      `Gostaria de ter mais informações sobre o produto ${categories?.categoryArray?.[0]?.singleName || ""} ${product.name}`
    );

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "request_quote_click",
        item_id: product.slug,
        item_name: `${cat?.singleName} ${product.name}`,
        item_category: cat?.name,
        item_category2: cat?.slug,
        item_variant: titlePrincipal,
        location: "product_page",
      });
    }

    window.location.assign("#contato");
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${categories?.categoryArray?.[0]?.singleName || ""} ${product.name}`,
    "image": images,
    "description":
      product.description ||
      cat?.description ||
      "Produto em aço de alta durabilidade e resistência.",
    "sku": product.slug,
    "brand": { "@type": "Brand", "name": "GGL Móveis de Aço" },
    "offers": {
      "@type": "Offer",
      "url": `https://www.gglmoveis.com.br/produtos/${cat?.slug}?product=${product.slug}`,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "priceCurrency": "BRL",
      "price": "0.00"
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
        <link
          rel="canonical"
          href={`https://www.gglmoveis.com.br/produtos/${cat?.slug}?product=${product.slug}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Header />
      <main className="tw-mt-[140px] tw-mb-[100px] tw-relative">
        <Navbar categories={categories} />

        <section
          id="product-wrapper"
          className="tw-flex tw-mb-[150px] tw-justify-between tw-flex-col lg:tw-flex-row tw-w-full md:tw-w-[85%] md:tw-ml-[15%] tw-px-[20px] tw-pt-[300px] md:tw-py-0 tw-gap-[20px]"
        >
          <div id="principal-image" className="tw-flex tw-flex-col tw-items-center tw-gap-5">
            {/* MOBILE: centralizado e pode cortar laterais */}
            <div className="md:tw-hidden tw-relative tw-w-full tw-max-w-[520px] tw-aspect-[3/4] tw-overflow-hidden tw-mx-auto">
              <Image
                src={principalImage}
                alt={`${product.name} - principal`}
                fill
                sizes="100vw"
                className="tw-object-cover tw-object-center"  // cobre o container e centraliza
                priority={false}
              />
            </div>

            {/* DESKTOP: mantém o ZoomLens como está */}
            <div className="tw-hidden md:tw-block">
              <ZoomLens
                key={principalImage}
                src={principalImage}
                width={600}
                height={520}
                zoom={2}
                item_id={product.slug}
                item_name={`${cat?.singleName} ${product.name}`}
                item_category={cat?.name}
                item_category2={cat?.slug}
              />
            </div>

            {images.length > 1 && (
              <div
                className="
        tw-flex tw-mt-[20px] tw-w-full tw-overflow-x-auto tw-overflow-y-hidden
        tw-justify-center md:tw-justify-start tw-gap-[10px] tw-mx-auto tw-max-w-[520px] tw-px-[6px]
      "
              >
                {images.length > 1 && (
                  <div className="tw-flex tw-mt-[20px] tw-w-full tw-overflow-x-auto tw-overflow-y-hidden md:tw-w-auto">
                    {images.map((image, i) => (
                      <Image
                        src={image}
                        key={`${image}-${i}`}
                        alt={`${product.name} - ${i + 1}`}
                        width={80}
                        height={80}
                        sizes="80px"
                        className="tw-object-contain tw-mr-[10px] hover:tw-scale-[1.1] tw-cursor-pointer"
                        onClick={() => {
                          setPrincipalImage(image);
                          setTable(i);
                          if (models[i]) setTitlePrincipal(models[i].name);

                          if (typeof window !== "undefined") {
                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({
                              event: "select_item",
                              item_list_name: "product_thumbnails",
                              items: [
                                {
                                  item_id: product.slug,
                                  item_name: `${cat?.singleName} ${product.name}`,
                                  item_category: cat?.name,
                                  item_category2: cat?.slug,
                                  item_variant: models[i]?.name || `variante_${i + 1}`,
                                  index: i + 1,
                                },
                              ],
                              location: "product_page",
                            });
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="tw-w-full lg:tw-w-[50%] tw-mt-[50px] lg:tw-mt-0">
            <h1 className="tw-text-[38px]">{titlePrincipal}</h1>
            <p>{product.description}</p>

            <h2 className="tw-text-[32px] tw-mt-[50px]">Medidas</h2>

            <div className="tw-w-full tw-overflow-x-auto">
              <table className="tw-w-full tw-min-w-[600px] tw-font-light tw-border-collapse">
                <thead>
                  <tr className="tw-font-bold">
                    <th className="tw-text-left tw-border tw-border-black tw-pt-[5px] tw-pb-[5px] tw-pr-[5px] tw-pl-[10px]">Modelo</th>
                    <th className="tw-text-left tw-border tw-border-black tw-pt-[5px] tw-pb-[5px] tw-pr-[5px] tw-pl-[10px]">Altura</th>
                    <th className="tw-text-left tw-border tw-border-black tw-pt-[5px] tw-pb-[5px] tw-pr-[5px] tw-pl-[10px]">Largura</th>
                    <th className="tw-text-left tw-border tw-border-black tw-pt-[5px] tw-pb-[5px] tw-pr-[5px] tw-pl-[10px]">Profundidade</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((model, i) => (
                    <tr
                      key={`${model.name}-${i}`}
                      className={images.length === 1 || i === table || product?.allBold
                        ? "tw-font-semibold"
                        : "tw-font-light"}
                    >
                      <td className="tw-border tw-border-black tw-pt-[5px] tw-pb-[5px] tw-pr-[5px] tw-pl-[10px]">{model.name}</td>
                      <td className="tw-border tw-border-black tw-pt-[5px] tw-pb-[5px] tw-pr-[5px] tw-pl-[10px]">{model.scale?.height ?? "-"}</td>
                      <td className="tw-border tw-border-black tw-pt-[5px] tw-pb-[5px] tw-pr-[5px] tw-pl-[10px]">{model.scale?.width ?? "-"}</td>
                      <td className="tw-border tw-border-black tw-pt-[5px] tw-pb-[5px] tw-pr-[5px] tw-pl-[10px]">{model.scale?.depth ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

        <Contact budgetMessage={contactMessage} />
      </main>
      <Footer />
    </div>
  );
}
