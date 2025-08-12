import React, { useState, useEffect } from "react";
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
      product: res.data,
      categories: categories.data,
    },
  };
}

export default function SingleProduct({ product, categories }) {
  const [principalImage, setPrincipalImage] = useState(product.images[0]);
  const [titlePrincipal, setTitlePrincipal] = useState(product.models[0].name);
  const [contactMessage, setContactMessage] = useState("");
  const [table, setTable] = useState(0);

  useEffect(() => {
    if (!product?.slug || !categories?.categoryArray?.[0] || !window.gtag) return;
    const cat = categories.categoryArray[0];
    window.gtag("event", "view_item", {
      items: [
        {
          item_id: product.slug,
          item_name: `${cat.singleName} ${product.name}`,
          item_category: cat.name,
          item_variant: titlePrincipal,
        },
      ],
    });
  }, [product, categories, titlePrincipal]);

  if (product.error) {
    return (
      <div className="tw-h-[100vh] tw-flex tw-items-center tw-flex-col tw-justify-center tw-w-full">
        <h1>O Produto selecionado não existe ou possui informações incorretas!</h1>
        <p>CÓDIGO DO ERRO: 404 Not Found</p>
      </div>
    );
  }

  const createBudget = () => {
    setContactMessage(
      `Gostaria de ter mais informações sobre o produto ${categories.categoryArray[0].singleName} ${product.name}`
    );

    if (window.gtag) {
      const cat = categories.categoryArray[0];
      window.gtag("event", "request_quote_click", {
        item_id: product.slug,
        item_name: `${cat.singleName} ${product.name}`,
        item_category: cat.name,
        item_variant: titlePrincipal,
        location: "product_page",
      });
    }

    window.location.assign("#contato");
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${categories.categoryArray[0].singleName} ${product.name}`,
    "image": product.images,
    "description":
      product.description ||
      categories?.categoryArray?.[0]?.description ||
      "Produto em aço de alta durabilidade e resistência.",
    "sku": product.slug,
    "brand": {
      "@type": "Brand",
      "name": "GGL Móveis de Aço"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.gglmoveis.com.br/produtos/${categories.categoryArray[0].slug}?product=${product.slug}`,
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
          GGL Móveis de Aço | {categories.categoryArray[0].name} - {product.name}
        </title>
        <meta
          name="description"
          content={
            product.description ||
            categories?.categoryArray?.[0]?.description ||
            "Conheça os móveis de aço da GGL: qualidade, durabilidade e acabamento superior."
          }
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://www.gglmoveis.com.br/produtos/${categories.categoryArray[0].slug}?product=${product.slug}`}
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
          <div className="tw-w-full lg:tw-w-[50%]">
            <div id="principal-image">
              <ZoomLens src={principalImage} />

              <div className="tw-flex tw-mt-[20px] tw-w-full tw-overflow-x-auto tw-overflow-y-hidden md:tw-w-auto">
                {product.images.length > 1 &&
                  product.images.map((image, i) => (
                    <Image
                      src={image}
                      key={i}
                      alt={`${product.name} - ${i + 1}`}
                      width={80}
                      height={80}
                      className="tw-object-contain tw-mr-[10px] hover:tw-scale-[1.1] tw-cursor-pointer"
                      onClick={() => {
                        setPrincipalImage(image);
                        setTable(i);
                        if (!!product.models[i]) {
                          setTitlePrincipal(product.models[i].name);
                        }
                        if (window.gtag) {
                          const cat = categories.categoryArray[0];
                          window.gtag("event", "select_item", {
                            item_list_name: "product_thumbnails",
                            items: [
                              {
                                item_id: product.slug,
                                item_name: `${cat.singleName} ${product.name}`,
                                item_category: cat.name,
                                item_variant: product.models[i]?.name || `variante_${i + 1}`,
                                index: i + 1,
                              },
                            ],
                          });
                        }
                      }}
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className="tw-w-full lg:tw-w-[50%] tw-mt-[50px] lg:tw-mt-0">
            <h1 className="tw-text-[38px]">{titlePrincipal}</h1>
            <p>{product.description}</p>

            <h2 className="tw-text-[32px] tw-mt-[50px]">Medidas</h2>
            <table className="tw-font-light tw-w-[calc(100vw-15%)] sm:tw-w-full tw-inline-block">
              <tbody className="tw-inline-block tw-w-[calc(100vw-15%)] md:tw-w-full tw-overflow-x-auto">
                <tr className="tw-w-[800px] tw-min-w-[600px] tw-flex md:tw-w-full tw-font-bold">
                  <td>Modelo</td>
                  <td>Altura</td>
                  <td>Largura</td>
                  <td>Profundidade</td>
                </tr>
                {product.models.map((model, i) => (
                  <tr
                    key={i}
                    className="tw-w-[800px] tw-min-w-[600px] tw-flex md:tw-w-full"
                    style={{
                      fontWeight:
                        product.images.length === 1
                          ? 600
                          : i === table || product?.allBold
                            ? 600
                            : 300,
                    }}
                  >
                    <td>{model.name}</td>
                    <td>{model.scale.height}</td>
                    <td>{model.scale.width}</td>
                    <td>{model.scale.depth}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="submit"
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