import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import SeoHead from "../components/layout/SeoHead";
import ContactForm from "../components/contact/ContactForm";
import { categories } from "../lib/catalog";
import { dlPush } from "../lib/analytics/dataLayer";
import { organizationJsonLd } from "../lib/seo/buildJsonLd";
import { AiOutlineCloudDownload } from "react-icons/ai";

export async function getStaticProps() {
  return { props: { categories }, revalidate: 300 };
}

export default function Home({ categories }) {
  const catalogRef = useRef(null);
  const catalogViewedRef = useRef(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  useEffect(() => {
    dlPush("view_homepage", { location: "home_page" });

    if ((categories || []).length) {
      dlPush("view_item_list", {
        location: "home_page",
        item_list_name: "Homepage categorias",
        items: categories.map((c, i) => ({
          item_id: c.slug,
          item_name: c.name,
          index: i + 1
        }))
      });
    }
  }, [categories]);

  useEffect(() => {
    if (!catalogRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && !catalogViewedRef.current) {
            catalogViewedRef.current = true;
            dlPush("catalog_view", { location: "home_page" });
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(catalogRef.current);
    return () => obs.disconnect();
  }, []);

  const onCtaClick = () => dlPush("cta_click", { position: "hero", text: "Solicitar orçamento", location: "home_page" });

  const onCategoryClick = (category) =>
    dlPush("select_item", {
      item_list_name: "Homepage categorias",
      items: [{ item_id: category.slug, item_name: category.name }],
      location: "home_page"
    });

  const onCatalogDownload = (where) => dlPush("catalog_download", { location: where, file: "/assets/catalogo.pdf" });

  const isSvg = (src) => typeof src === "string" && /\.svg(\?.*)?$/i.test(src);

  return (
    <div>
      <SeoHead
        title="Móveis de Aço para Empresas | GGL Móveis de Aço"
        description="Soluções em móveis de aço para empresas, escolas, indústrias e órgãos públicos. Conheça a GGL e solicite um orçamento."
        canonical="https://www.gglmoveis.com.br/"
        image="https://www.gglmoveis.com.br/assets/banners/uepg-banner1.png"
        jsonLd={organizationJsonLd()}
      />

      <main className="tw-mt-[110px] tw-mb-[130px] tw-max-w-[1920px] tw-mx-auto">
        <section className="tw-relative tw-w-full">
          <Image
            src="/assets/banners/uepg-banner1.png"
            alt="Banner principal da GGL"
            fill
            priority
            fetchPriority="high"
            quality={90}
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <div className="tw-absolute tw-inset-0 tw-bg-[#0058C2] tw-opacity-[20%] tw-z-[1]" />
          <div className="tw-relative tw-z-[2] tw-flex tw-items-center tw-justify-start tw-max-w-[1597px] tw-px-[5%] tw-mx-auto tw-w-full tw-py-[150px]">
            <div className="tw-flex tw-flex-col tw-text-white">
              <h1 className="tw-text-[30px] md:tw-text-[40px] tw-mb-[20px]">Móveis de aço para empresas</h1>
              <p className="tw-max-w-[420px] tw-w-full tw-mb-[30px]">
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

        <section className="tw-w-full tw-px-[20px] tw-mt-[60px]">
          <div className="tw-flex tw-items-center tw-justify-center tw-gap-[18px]">
            <span className="tw-hidden md:tw-block tw-h-[3px] tw-w-[20%] tw-rounded-[10px] tw-bg-blue" aria-hidden="true" />
            <h2 className="tw-text-[24px] tw-text-blue tw-text-center">Conheça nossa linha de produtos</h2>
            <span className="tw-hidden md:tw-block tw-h-[3px] tw-w-[20%] tw-rounded-[10px] tw-bg-blue" aria-hidden="true" />
          </div>
        </section>

        <section className="tw-px-[20px] tw-flex tw-justify-center tw-items-start tw-flex-wrap tw-gap-y-[80px] tw-gap-x-[40px] tw-mb-[120px] tw-max-w-[1024px] tw-w-full tw-mx-auto">
          {(categories || []).map((category) => {
            const img = category.image;
            return (
              <Link
                key={category.slug}
                href={`/produtos/${category.slug}`}
                className="tw-flex tw-flex-col tw-items-center tw-transition-transform tw-duration-300 hover:tw-scale-105"
                onClick={() => onCategoryClick(category)}
              >
                <div className="tw-w-[160px] tw-h-[160px] tw-flex tw-items-center tw-justify-center">
                  {isSvg(img) ? (
                    <img
                      src={img}
                      alt={`Categoria ${category.name} da GGL Móveis de Aço`}
                      width={160}
                      height={160}
                      loading="lazy"
                      decoding="async"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <Image
                      src={img}
                      alt={`Categoria ${category.name} da GGL Móveis de Aço`}
                      width={160}
                      height={160}
                      sizes="160px"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  )}
                </div>
                <div className="tw-mt-[20px] tw-text-center">
                  <h3 className="tw-text-[18px] tw-bg-blue tw-text-white tw-py-[5px] tw-px-[10px]">{category.name}</h3>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="tw-px-[20px] tw-max-w-[1024px] tw-w-full tw-mx-auto tw-py-[110px] md:tw-py-[130px] tw-scroll-mt-[140px]" id="catalogo" ref={catalogRef}>
          <small className="tw-text-blue">CATÁLOGO</small>
          <h2 className="tw-text-[30px]">Nosso catálogo</h2>
          <div className="tw-flex tw-items-center tw-justify-around tw-mt-[40px] tw-flex-col md:tw-flex-row tw-gap-[20px]">
            <a href="/assets/catalogo.pdf" target="_blank" rel="noopener noreferrer" onClick={() => onCatalogDownload("imagem")}>
              <Image src="/assets/banners/catalogo.png" alt="Download do catálogo da GGL" width={300} height={424} sizes="300px" />
            </a>
            <div>
              <p className="tw-max-w-[360px] tw-w-full tw-mb-[30px]">Baixe nosso catálogo para acessar especificações técnicas dos produtos da GGL.</p>
              <a
                href="/assets/catalogo.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-flex tw-items-center tw-gap-2 hover:tw-underline"
                onClick={() => onCatalogDownload("botao")}
              >
                <AiOutlineCloudDownload size={26} className="tw-shrink-0" aria-hidden="true" />
                <span className="tw-text-[18px] md:tw-text-[20px]">Baixar catálogo</span>
              </a>
            </div>
          </div>
        </section>

        <section className="tw-px-[20px] tw-max-w-[1024px] tw-w-full tw-mx-auto tw-py-[110px] md:tw-py-[130px] tw-scroll-mt-[140px]" id="sobre">
          <small className="tw-text-blue">EMPRESA</small>
          <h2 className="tw-text-[30px]">Sobre nós</h2>
          <div className="tw-flex tw-items-center tw-justify-around tw-gap-[20px] tw-mt-[40px] tw-max-w-[1280px] tw-mx-auto tw-flex-col md:tw-flex-row">
            <div className="tw-w-full md:tw-w-[50%]">
              <p className="tw-mb-[30px]">
                Desde 1999 fornecendo móveis de aço com qualidade e rapidez. Com sede própria de 10.300m², produzimos nossas próprias matrizes e equipamentos para garantir precisão e acabamento superior.
                Atendemos diversos estados com parcerias e respeito aos clientes.
              </p>
            </div>
            <div className="tw-w-full md:tw-w-[50%]">
              <Image
                src="/assets/banners/empresa.jpg"
                alt="Instalações da empresa GGL"
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="tw-w-full tw-h-auto"
              />
            </div>
          </div>
        </section>

        <ContactForm />
      </main>
    </div>
  );
}
