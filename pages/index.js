import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import Contact from "../components/contact";
import ReactPlayer from "react-player";
import { AiOutlineCloudDownload } from "react-icons/ai";
import api from "../services/api";
import { useEffect, useRef, useState } from "react";

export async function getStaticProps() {
  const res = await api.get("/category?category=all");
  return { props: { categories: res.data }, revalidate: 5 };
}

export default function Home({ categories }) {
  const [isClient, setIsClient] = useState(false);
  const catalogRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (!isClient || !window.gtag) return;
    window.gtag("event", "view_homepage", {});
    if (categories?.categoryArray?.length) {
      window.gtag("event", "view_item_list", {
        item_list_name: "Homepage categorias",
        items: categories.categoryArray.map((c, i) => ({
          item_id: c.slug,
          item_name: c.name,
          index: i + 1,
        })),
      });
    }
  }, [isClient, categories]);

  useEffect(() => {
    if (!isClient || !catalogRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && window.gtag) {
            window.gtag("event", "catalog_view", { section: "homepage" });
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(catalogRef.current);
    return () => obs.disconnect();
  }, [isClient]);

  const onCtaClick = () => {
    if (window.gtag) window.gtag("event", "cta_click", { position: "hero", text: "Solicitar orçamento", location: "home_page" });
  };

  const onCategoryClick = (category) => {
    if (window.gtag) {
      window.gtag("event", "select_item", {
        item_list_name: "Homepage categorias",
        items: [{ item_id: category.slug, item_name: category.name }],
      });
    }
  };

  const onCatalogDownload = (where) => {
    if (window.gtag) window.gtag("event", "catalog_download", { location: where, file: "/assets/catalogo.pdf" });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GGL Móveis de Aço",
    "url": "https://www.gglmoveis.com.br",
    "logo": "https://www.gglmoveis.com.br/logo.svg",
    "description": "Fabricante de móveis de aço para ambientes corporativos, industriais e institucionais. Qualidade, durabilidade e acabamento superior.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-42-3025-2200",
      "contactType": "customer service",
      "areaServed": "BR",
      "availableLanguage": "Portuguese"
    },
    "sameAs": ["https://www.instagram.com/gglmoveisdeaco/"]
  };

  return (
    <div>
      <Head>
        <title>Móveis de Aço para Empresas | GGL Móveis de Aço</title>
        <meta name="description" content="Soluções em móveis de aço para empresas, escolas, indústrias e órgãos públicos. Conheça a GGL e solicite um orçamento." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.gglmoveis.com.br/" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      <Header />

      {isClient && (
        <main className="tw-mt-[110px] tw-mb-[130px] tw-max-w-[1920px] tw-mx-auto">
          <section className="tw-relative tw-w-full">
            <Image
              src="/assets/banners/uepg-banner1.png"
              alt="Banner principal da GGL"
              layout="fill"
              objectFit="cover"
              quality={90}
              priority
            />
            <div className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-bg-[#0058C2] tw-opacity-[20%] z-[1]" />
            <div className="tw-relative tw-z-[2] tw-flex tw-items-center tw-justify-start tw-max-w-[1597px] tw-px-[5%] tw-mx-auto tw-w-full tw-py-[150px]">
              <div className="tw-flex tw-flex-col tw-text-white">
                <h1 className="tw-text-[30px] md:tw-text-[40px] tw-mb-[20px]">GGL</h1>
                <p className="tw-max-w-[300px] tw-w-full tw-mb-[30px]">
                  Móveis de excelente qualidade, resistência e acabamento superior para seu espaço.
                </p>
                <a
                  href="#contato"
                  className="tw-text-white tw-w-fit tw-relative before:tw-content-[''] before:tw-absolute before:tw-left-0 before:tw-bottom-0 before:tw-bg-white before:tw-h-[2px] before:tw-w-1/2 hover:before:tw-w-full before:tw-duration-500 tw-text-[16px] tw-font-medium"
                  onClick={onCtaClick}
                >
                  Solicitar orçamento
                </a>
              </div>
            </div>
          </section>

          <div className="tw-w-full tw-px-[20px]">
            <h2 className="tw-flex tw-justify-center tw-items-center tw-text-[24px] tw-text-darkBlue tw-my-[60px]">
              <hr className="tw-w-[30%] tw-bg-blue tw-rounded-[10px] tw-h-[3px] tw-mr-[30px]" />
              Conheça nossa linha de produtos
              <hr className="tw-w-[30%] tw-bg-blue tw-rounded-[10px] tw-h-[3px] tw-ml-[30px]" />
            </h2>
          </div>

          <section className="tw-px-[20px] tw-flex tw-justify-center tw-items-center tw-flex-wrap tw-gap-y-[80px] tw-gap-x-[40px] tw-mb-[120px] tw-max-w-[1024px] tw-w-full tw-mx-auto">
            {categories.categoryArray.map((category) => (
              <Link
                key={category.slug}
                href={`/produtos/${category.slug}?product=${category.products[0].slug}`}
                passHref
              >
                <a
                  className="tw-flex tw-flex-col tw-items-center tw-transition-transform tw-duration-300 hover:tw-scale-105"
                  onClick={() => onCategoryClick(category)}
                >
                  <div className="tw-w-[100px] md:tw-w-[160px]">
                    <Image
                      src={category.image}
                      alt={`Categoria ${category.name} da GGL Móveis de Aço`}
                      width={160}
                      height={160}
                      layout="intrinsic"
                      className="tw-object-contain"
                    />
                  </div>
                  <div className="tw-mt-[20px]">
                    <h3 className="tw-text-[18px] tw-bg-darkBlue tw-text-white tw-py-[5px] tw-px-[10px]">
                      {category.name}
                    </h3>
                  </div>
                </a>
              </Link>
            ))}
          </section>

          <section
            className="tw-px-[20px] tw-max-w-[1024px] tw-w-full tw-mx-auto tw-pt-[150px] pb-[100px] tw-mt-[-100px]"
            id="catalogo"
            ref={catalogRef}
          >
            <small className="tw-text-blue">CATÁLOGO</small>
            <h2 className="tw-text-[30px]">Nosso catálogo</h2>
            <div className="tw-flex tw-items-center tw-justify-around tw-mt-[40px] tw-flex-col md:tw-flex-row tw-gap-[20px]">
              <a
                href="/assets/catalogo.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onCatalogDownload("imagem")}
              >
                <Image
                  src="/assets/banners/catalogo.png"
                  alt="Download do catálogo da GGL"
                  width={300}
                  height={424}
                  layout="intrinsic"
                />
              </a>
              <div>
                <p className="tw-max-w-[360px] tw-w-full tw-mb-[30px]">
                  Baixe nosso catálogo para acessar especificações técnicas dos produtos da GGL.
                </p>
                <a
                  href="/assets/catalogo.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tw-flex tw-items-center hover:tw-underline"
                  onClick={() => onCatalogDownload("botao")}
                >
                  <AiOutlineCloudDownload />
                  <span className="tw-ml-[10px]">Baixar catálogo</span>
                </a>
              </div>
            </div>
          </section>

          <section
            className="tw-px-[20px] tw-py-[200px] tw-max-w-[1024px] tw-w-full tw-mx-auto tw-mt-[-100px]"
            id="sobre"
          >
            <small className="tw-text-blue">EMPRESA</small>
            <h2 className="tw-text-[30px]">Sobre nós</h2>
            <div className="tw-flex tw-items-center tw-justify-around tw-gap-[20px] tw-mt-[40px] tw-max-w-[1280px] tw-mx-auto tw-flex-col md:tw-flex-row">
              <div className="tw-w-full md:tw-w-[50%]">
                <p className="tw-mb-[30px]">
                  Desde 1999 fornecendo móveis de aço com qualidade e rapidez. Com sede própria de 10.300m²,
                  produzimos nossas próprias matrizes e equipamentos para garantir precisão e acabamento superior.
                  Atendemos diversos estados com parcerias e respeito aos clientes.
                </p>
              </div>
              <div className="tw-w-full md:tw-w-[50%]">
                <Image
                  src="/assets/banners/empresa.jpg"
                  alt="Instalações da empresa GGL"
                  width={800}
                  height={600}
                  className="tw-w-full tw-h-auto"
                />
              </div>
            </div>
          </section>

          <Contact />
        </main>
      )}

      <Footer />
    </div>
  );
}