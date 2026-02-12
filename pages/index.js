import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import SeoHead from "../components/layout/SeoHead";
import ContactForm from "../components/contact/ContactForm";
import Reveal from "../components/animations/Reveal";
import { categories } from "../lib/catalog";
import { organizationJsonLd } from "../lib/seo/buildJsonLd";
import { AiOutlineCheckCircle, AiOutlineCloudDownload } from "react-icons/ai";
import {
  trackCatalogDownload,
  trackCatalogView,
  trackHomepageCategoryListView,
  trackHomepageCategorySelect,
  trackHomepageCtaClick,
  trackHomepageView
} from "../lib/analytics/events";

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
    trackHomepageView({ location: "home_page" });

    if ((categories || []).length) {
      trackHomepageCategoryListView({
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
            trackCatalogView({ location: "home_page" });
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(catalogRef.current);
    return () => obs.disconnect();
  }, []);

  const onCtaClick = () =>
    trackHomepageCtaClick({
      position: "hero",
      text: "Solicitar orçamento",
      location: "home_page"
    });

  const onCategoryClick = (category) =>
    trackHomepageCategorySelect({
      item_id: category.slug,
      item_name: category.name,
      item_list_name: "Homepage categorias",
      location: "home_page"
    });

  const onCatalogDownload = (where) =>
    trackCatalogDownload({ location: where, file: "/assets/catalogo.pdf" });

  const isSvg = (src) => typeof src === "string" && /\.svg(\?.*)?$/i.test(src);

  const highlights = [
    { value: "1999", label: "atendendo empresas em todo o Brasil" },
    { value: "10.300m²", label: "de estrutura própria de produção" },
    { value: "B2B", label: "soluções para indústria, escolas e órgãos públicos" }
  ];

  const categoryAccents = [
    "tw-from-blue/25 tw-via-sky-100/75 tw-to-cyan-100/65",
    "tw-from-slate-100 tw-via-blue-100/65 tw-to-indigo-100/70",
    "tw-from-cyan-100/70 tw-via-sky-100/70 tw-to-blue-100/65",
    "tw-from-blue-100/75 tw-via-slate-100 tw-to-sky-100/70"
  ];

  return (
    <div>
      <SeoHead
        title="Móveis de Aço para Empresas | GGL Móveis de Aço"
        description="Soluções em móveis de aço para empresas, escolas, indústrias e órgãos públicos. Conheça a GGL e solicite um orçamento."
        canonical="https://www.gglmoveis.com.br/"
        image="https://www.gglmoveis.com.br/assets/banners/uepg-banner1.png"
        jsonLd={organizationJsonLd()}
      />

      <main className="tw-mt-[110px] tw-max-w-[1920px] tw-mx-auto tw-overflow-hidden tw-bg-[radial-gradient(circle_at_18%_24%,rgba(191,219,254,0.42),transparent_46%),radial-gradient(circle_at_82%_12%,rgba(14,165,233,0.20),transparent_44%),linear-gradient(180deg,#f8fafc_0%,#ffffff_56%,#f8fafc_100%)]">
        <section className="tw-relative tw-w-full tw-min-h-[540px]">
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
          <div className="tw-absolute tw-inset-0 tw-bg-[linear-gradient(100deg,rgba(15,23,42,0.88)_8%,rgba(0,88,194,0.58)_46%,rgba(15,23,42,0.35)_100%)] tw-z-[1]" />
          <div className="tw-absolute tw-z-[1] tw-right-[-120px] tw-top-[-90px] tw-w-[360px] tw-h-[360px] tw-rounded-full tw-bg-cyan-300/20 tw-blur-3xl" />
          <div className="tw-absolute tw-z-[1] tw-left-[-90px] tw-bottom-[-130px] tw-w-[280px] tw-h-[280px] tw-rounded-full tw-bg-blue/30 tw-blur-3xl" />

          <div className="tw-relative tw-z-[2] tw-max-w-[1597px] tw-px-[5%] tw-mx-auto tw-w-full tw-pt-[86px] tw-pb-[98px] md:tw-pt-[108px] md:tw-pb-[120px]">
            <Reveal direction="up" duration={650}>
              <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-[1.1fr_0.9fr] tw-gap-[26px] tw-items-end">
                <div className="tw-flex tw-flex-col tw-text-white">
                  <small className="tw-inline-flex tw-items-center tw-gap-[8px] tw-w-fit tw-rounded-full tw-bg-white/15 tw-px-[12px] tw-py-[5px] tw-tracking-[0.08em] tw-text-[12px] tw-font-semibold">
                    GGL MÓVEIS DE AÇO <span className="tw-w-[6px] tw-h-[6px] tw-rounded-full tw-bg-cyan-200" aria-hidden="true" />
                  </small>
                  <h1 className="tw-text-[32px] md:tw-text-[48px] tw-leading-[1.08] tw-mt-[16px] tw-font-semibold">
                    Estrutura profissional para ambientes que exigem durabilidade
                  </h1>
                  <p className="tw-max-w-[560px] tw-w-full tw-mt-[14px] tw-text-[16px] md:tw-text-[18px] tw-leading-[1.5] tw-text-slate-100">
                    Soluções em móveis de aço com acabamento superior para indústria, comércio, escolas e órgãos públicos.
                  </p>
                  <div className="tw-mt-[28px] tw-flex tw-flex-wrap tw-items-center tw-gap-[14px]">
                    <a
                      href="#contato"
                      className="tw-inline-flex tw-items-center tw-justify-center tw-gap-[8px] tw-rounded-full tw-bg-white tw-text-darkBlue tw-font-semibold tw-px-[20px] tw-py-[12px] tw-transition hover:tw-bg-slate-100"
                      onClick={onCtaClick}
                    >
                      Solicitar orçamento <span aria-hidden="true">→</span>
                    </a>
                    <a
                      href="#catalogo"
                      className="tw-inline-flex tw-items-center tw-justify-center tw-gap-[8px] tw-rounded-full tw-border tw-border-white/45 tw-text-white tw-font-medium tw-px-[18px] tw-py-[11px] tw-transition hover:tw-bg-white/10"
                    >
                      Ver catálogo
                    </a>
                  </div>
                </div>

                <div className="tw-hidden lg:tw-flex tw-justify-end">
                  <div className="tw-w-full tw-max-w-[420px] tw-rounded-[30px] tw-border tw-border-white/35 tw-bg-white/10 tw-backdrop-blur-md tw-p-[20px] tw-shadow-[0_24px_38px_-26px_rgba(15,23,42,0.8)]">
                    <p className="tw-text-white tw-font-semibold tw-text-[18px]">Estrutura pensada para operação real</p>
                    <ul className="tw-mt-[14px] tw-space-y-[10px]">
                      <li className="tw-flex tw-items-start tw-gap-[8px] tw-text-slate-100">
                        <AiOutlineCheckCircle className="tw-mt-[2px] tw-shrink-0" aria-hidden="true" />
                        Produção própria e controle de qualidade interno.
                      </li>
                      <li className="tw-flex tw-items-start tw-gap-[8px] tw-text-slate-100">
                        <AiOutlineCheckCircle className="tw-mt-[2px] tw-shrink-0" aria-hidden="true" />
                        Projetos para alto fluxo e uso contínuo.
                      </li>
                      <li className="tw-flex tw-items-start tw-gap-[8px] tw-text-slate-100">
                        <AiOutlineCheckCircle className="tw-mt-[2px] tw-shrink-0" aria-hidden="true" />
                        Atendimento consultivo do orçamento à entrega.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-h-[84px] tw-bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(248,250,252,0.95)_80%,rgba(248,250,252,1)_100%)]" />
        </section>

        <section className="tw-px-[20px] tw-relative tw-z-[3] -tw-mt-[36px]">
          <Reveal direction="up">
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-[12px] tw-max-w-[1100px] tw-mx-auto">
              {highlights.map((item, index) => (
                <article
                  key={item.value}
                  className={[
                    "tw-rounded-[22px] tw-border tw-border-slate-200 tw-bg-white/95 tw-p-[16px] tw-shadow-[0_16px_28px_-24px_rgba(15,23,42,0.6)]",
                    index === 1 ? "md:-tw-mt-[10px]" : ""
                  ].join(" ")}
                >
                  <p className="tw-text-[28px] tw-leading-[1] tw-font-semibold tw-text-blue">{item.value}</p>
                  <p className="tw-mt-[8px] tw-text-[14px] tw-text-slate-600">{item.label}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="tw-px-[20px] tw-mt-[54px] tw-mb-[88px]">
          <Reveal direction="up">
            <div className="tw-max-w-[1200px] tw-mx-auto tw-flex tw-items-center tw-justify-between tw-gap-[16px] tw-flex-wrap">
              <div>
                <small className="tw-text-blue tw-font-semibold tw-tracking-[0.08em]">LINHA DE PRODUTOS</small>
                <h2 className="tw-text-[30px] tw-leading-[1.1] tw-text-darkBlue tw-mt-[6px]">Categorias que organizam operação e fluxo</h2>
              </div>
              <a href="/produtos" className="tw-text-blue tw-font-medium hover:tw-underline">
                Ver linha completa
              </a>
            </div>
          </Reveal>

          <div className="tw-max-w-[1200px] tw-mx-auto tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-[16px] tw-mt-[20px]">
            {(categories || []).map((category, index) => {
              const img = category.image;
              const accent = categoryAccents[index % categoryAccents.length];
              const firstProductSlug = category?.products?.[0]?.slug;
              const categoryHref = firstProductSlug
                ? `/produtos/${category.slug}/${firstProductSlug}`
                : `/produtos/${category.slug}`;

              return (
                <Reveal key={category.slug} direction="up" delay={Math.min(index * 80, 320)}>
                  <Link
                    href={categoryHref}
                    className={[
                      "tw-group tw-block tw-w-full tw-relative tw-isolate tw-overflow-hidden tw-rounded-[28px] tw-border tw-border-slate-200/80 tw-bg-white tw-p-[14px]",
                      "tw-shadow-[0_16px_28px_-22px_rgba(15,23,42,0.65)] tw-transition-all tw-duration-300 hover:-tw-translate-y-[5px] hover:tw-shadow-[0_26px_38px_-22px_rgba(15,23,42,0.55)]"
                    ].join(" ")}
                    onClick={() => onCategoryClick(category)}
                  >
                    <div
                      className={`tw-absolute tw-z-[1] tw-inset-[1px] tw-rounded-[26px] tw-bg-gradient-to-br ${accent} tw-opacity-75 tw-pointer-events-none`}
                      aria-hidden="true"
                    />
                    <div className="tw-relative tw-z-[2]">
                      <div className="tw-h-[160px] tw-w-full tw-rounded-[20px] tw-overflow-hidden tw-bg-white/92 tw-flex tw-items-center tw-justify-center">
                        {isSvg(img) ? (
                          <img
                            src={img}
                            alt={`Categoria ${category.name} da GGL Móveis de Aço`}
                            width={150}
                            height={150}
                            loading="lazy"
                            decoding="async"
                            style={{ width: "150px", height: "150px", objectFit: "contain" }}
                          />
                        ) : (
                          <Image
                            src={img}
                            alt={`Categoria ${category.name} da GGL Móveis de Aço`}
                            width={150}
                            height={150}
                            sizes="150px"
                            style={{ width: "150px", height: "150px", objectFit: "contain" }}
                          />
                        )}
                      </div>

                      <div className="tw-mt-[14px] tw-flex tw-items-center tw-justify-between tw-gap-[10px]">
                        <h3 className="tw-text-[16px] tw-font-semibold tw-text-darkBlue tw-leading-[1.2]">{category.name}</h3>
                        <span
                          aria-hidden="true"
                          className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-w-[28px] tw-h-[28px] tw-bg-white/90 tw-text-blue tw-transition-transform group-hover:tw-translate-x-[2px]"
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="tw-px-[20px] tw-max-w-[1200px] tw-w-full tw-mx-auto tw-py-[72px] md:tw-py-[88px] tw-scroll-mt-[140px]" id="catalogo" ref={catalogRef}>
          <Reveal direction="up">
            <div className="tw-relative tw-overflow-hidden tw-rounded-[34px] tw-bg-[linear-gradient(130deg,#0f172a_0%,#0058c2_56%,#1d4ed8_100%)] tw-text-white tw-p-[22px] md:tw-p-[34px] tw-shadow-[0_28px_44px_-28px_rgba(15,23,42,0.75)]">
              <div className="tw-absolute tw-right-[-70px] tw-top-[-70px] tw-w-[220px] tw-h-[220px] tw-rounded-full tw-bg-cyan-300/25 tw-blur-3xl" aria-hidden="true" />
              <div className="tw-absolute tw-left-[-80px] tw-bottom-[-90px] tw-w-[240px] tw-h-[240px] tw-rounded-full tw-bg-blue-300/20 tw-blur-3xl" aria-hidden="true" />

              <div className="tw-relative tw-z-[2] tw-grid tw-grid-cols-1 lg:tw-grid-cols-[0.85fr_1.15fr] tw-gap-[26px] tw-items-center">
                <a
                  href="/assets/catalogo.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onCatalogDownload("imagem")}
                  className="tw-relative tw-w-fit tw-mx-auto lg:tw-mx-0"
                >
                  <span className="tw-absolute -tw-inset-[10px] tw-rounded-[24px] tw-border tw-border-white/35" aria-hidden="true" />
                  <Image
                    src="/assets/banners/catalogo.png"
                    alt="Download do catálogo da GGL"
                    width={310}
                    height={438}
                    sizes="310px"
                    className="tw-relative tw-rounded-[18px] tw-shadow-[0_20px_36px_-18px_rgba(15,23,42,0.85)]"
                  />
                </a>

                <div>
                  <small className="tw-text-cyan-100 tw-font-semibold tw-tracking-[0.08em]">CATÁLOGO TÉCNICO</small>
                  <h2 className="tw-text-[31px] tw-leading-[1.1] tw-mt-[6px]">Especificações para decisão rápida</h2>
                  <p className="tw-mt-[12px] tw-max-w-[520px] tw-text-slate-100">
                    Acesse medidas, aplicações e detalhes técnicos dos principais produtos da GGL em um material direto para apoiar seu planejamento.
                  </p>

                  <ul className="tw-mt-[14px] tw-space-y-[8px] tw-text-slate-100">
                    <li className="tw-flex tw-items-center tw-gap-[8px]">
                      <AiOutlineCheckCircle className="tw-shrink-0" aria-hidden="true" /> Dimensões e variações por linha.
                    </li>
                    <li className="tw-flex tw-items-center tw-gap-[8px]">
                      <AiOutlineCheckCircle className="tw-shrink-0" aria-hidden="true" /> Estrutura e acabamento dos móveis.
                    </li>
                    <li className="tw-flex tw-items-center tw-gap-[8px]">
                      <AiOutlineCheckCircle className="tw-shrink-0" aria-hidden="true" /> Referência para orçamento e implantação.
                    </li>
                  </ul>

                  <a
                    href="/assets/catalogo.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-bg-white tw-text-darkBlue tw-font-semibold tw-px-[18px] tw-py-[11px] tw-mt-[20px] hover:tw-bg-slate-100 tw-transition"
                    onClick={() => onCatalogDownload("botao")}
                  >
                    <AiOutlineCloudDownload size={22} className="tw-shrink-0" aria-hidden="true" />
                    <span>Baixar catálogo</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="tw-px-[20px] tw-max-w-[1200px] tw-w-full tw-mx-auto tw-py-[70px] md:tw-py-[88px] tw-scroll-mt-[140px]" id="sobre">
          <Reveal direction="up">
            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-[1fr_1.05fr] tw-gap-[26px] tw-items-center">
              <div className="tw-relative tw-rounded-[30px] tw-border tw-border-slate-200 tw-bg-white tw-p-[22px] md:tw-p-[30px] tw-shadow-[0_20px_36px_-26px_rgba(15,23,42,0.45)]">
                <span className="tw-absolute tw-right-[24px] tw-top-[22px] tw-inline-flex tw-items-center tw-rounded-full tw-bg-blue/10 tw-text-blue tw-px-[10px] tw-py-[4px] tw-text-[12px] tw-font-semibold">
                  EMPRESA
                </span>
                <h2 className="tw-text-[31px] tw-leading-[1.08] tw-text-darkBlue tw-mt-[10px]">Experiência industrial com foco em entrega</h2>
                <p className="tw-mt-[14px] tw-text-slate-600 tw-leading-[1.55]">
                  Desde 1999 fornecendo móveis de aço com qualidade e rapidez. Com sede própria de 10.300m², produzimos nossas próprias matrizes e equipamentos para garantir precisão e acabamento superior.
                  Atendemos diversos estados com parcerias e respeito aos clientes.
                </p>

                <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-[10px] tw-mt-[18px]">
                  <div className="tw-rounded-[16px] tw-bg-slate-50 tw-border tw-border-slate-200 tw-p-[10px]">
                    <p className="tw-text-blue tw-font-semibold">+25 anos</p>
                    <p className="tw-text-[13px] tw-text-slate-600">de mercado B2B</p>
                  </div>
                  <div className="tw-rounded-[16px] tw-bg-slate-50 tw-border tw-border-slate-200 tw-p-[10px]">
                    <p className="tw-text-blue tw-font-semibold">Produção própria</p>
                    <p className="tw-text-[13px] tw-text-slate-600">com controle técnico</p>
                  </div>
                  <div className="tw-rounded-[16px] tw-bg-slate-50 tw-border tw-border-slate-200 tw-p-[10px]">
                    <p className="tw-text-blue tw-font-semibold">Cobertura nacional</p>
                    <p className="tw-text-[13px] tw-text-slate-600">com parceiros regionais</p>
                  </div>
                </div>
              </div>

              <div className="tw-relative">
                <div className="tw-absolute -tw-inset-[10px] tw-rounded-[32px] tw-bg-gradient-to-br tw-from-blue/20 tw-via-cyan-100/45 tw-to-transparent" aria-hidden="true" />
                <div className="tw-relative tw-rounded-[30px] tw-overflow-hidden tw-border tw-border-slate-200 tw-shadow-[0_24px_40px_-26px_rgba(15,23,42,0.55)]">
                  <Image
                    src="/assets/banners/empresa.jpg"
                    alt="Instalações da empresa GGL"
                    width={900}
                    height={680}
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    className="tw-w-full tw-h-auto"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="tw-px-[20px] tw-mt-[6px]">
          <Reveal direction="up">
            <ContactForm />
          </Reveal>
        </section>
      </main>
    </div>
  );
}
