import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

//Components
import Header from "../components/header";
import Footer from "../components/footer";
import Contact from "../components/contact";

//player
import ReactPlayer from "react-player";

//icons
import { AiOutlineCloudDownload } from "react-icons/ai";

//api
import api from "../services/api";
import { useEffect, useState } from "react";

export async function getStaticProps() {
  const res = await api.get("/category?category=all");

  return {
    props: {
      categories: res.data,
    },
    revalidate: 5,
  };
}

export default function Home({ categories }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

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
    "sameAs": [
      "https://www.instagram.com/gglmoveisdeaco/",
    ]
  };


  return (
    <div>
      <Head>
        <title>GGL Móveis de Aço | Móveis de qualidade para seu ambiente profissional</title>
        <meta
          name="description"
          content="Móveis de aço de alta qualidade, resistentes e com design moderno para ambientes profissionais, corporativos e industriais. Conheça a GGL."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.gglmoveis.com.br/" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>

      <Header />

      {isClient && (
        <main className="tw-mt-[110px] tw-mb-[130px] tw-max-w-[1920px] tw-mx-auto">
          {/* Banner principal */}

          <section className="tw-relative tw-w-full">
            {/* Imagem otimizada */}
            <Image
              src="/assets/banners/uepg-banner1.png"
              alt="Banner principal da GGL"
              layout="fill"
              objectFit="cover"
              quality={90}
              priority
            />

            {/* Overlay azul */}
            <div className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full tw-bg-[#0058C2] tw-opacity-[20%] z-[1]" />

            {/* Conteúdo com padding vertical igual ao original */}
            <div className="tw-relative tw-z-[2] tw-flex tw-items-center tw-justify-start tw-max-w-[1597px] tw-px-[5%] tw-mx-auto tw-w-full tw-py-[150px]">
              <div className="tw-flex tw-flex-col tw-text-white">
                <h1 className="tw-text-[30px] md:tw-text-[40px] tw-mb-[20px]">GGL</h1>
                <p className="tw-max-w-[300px] tw-w-full">
                  Móveis de excelente qualidade, resistência e acabamento superior para seu espaço.
                </p>
              </div>
            </div>
          </section>

          {/* Título das categorias */}
          <div className="tw-w-full tw-px-[20px]">
            <h2 className="tw-flex tw-justify-center tw-items-center tw-text-[24px] tw-text-darkBlue tw-my-[60px]">
              <hr className="tw-w-[30%] tw-bg-blue tw-rounded-[10px] tw-h-[3px] tw-mr-[30px]" />
              Conheça nossa linha de produtos
              <hr className="tw-w-[30%] tw-bg-blue tw-rounded-[10px] tw-h-[3px] tw-ml-[30px]" />
            </h2>
          </div>

          {/* Lista de categorias */}
          <section className="tw-px-[20px] tw-flex tw-justify-center tw-items-center tw-flex-wrap tw-gap-y-[80px] tw-gap-x-[40px] tw-mb-[120px] tw-max-w-[1024px] tw-w-full tw-mx-auto">
            {categories.categoryArray.map((category) => (
              <Link
                key={category.slug}
                href={`/produtos/${category.slug}?product=${category.products[0].slug}`}
                passHref
              >
                <a className="tw-flex tw-flex-col tw-items-center tw-transition-transform tw-duration-300 hover:tw-scale-105">
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

          {/* Catálogo */}
          <section
            className="tw-px-[20px] tw-max-w-[1024px] tw-w-full tw-mx-auto tw-pt-[150px] pb-[100px] tw-mt-[-100px]"
            id="catalogo"
          >
            <small className="tw-text-blue">CATÁLOGO</small>
            <h2 className="tw-text-[30px]">Nosso catálogo</h2>
            <div className="tw-flex tw-items-center tw-justify-around tw-mt-[40px] tw-flex-col md:tw-flex-row tw-gap-[20px]">
              <a href="/assets/catalogo.pdf" target="_blank" rel="noopener noreferrer">
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
                >
                  <AiOutlineCloudDownload />
                  <span className="tw-ml-[10px]">Baixar catálogo</span>
                </a>
              </div>
            </div>
          </section>

          {/* Sobre a empresa */}
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
                <img
                  src="/assets/banners/empresa.jpg"
                  alt="Instalações da empresa GGL"
                  className="tw-w-full"
                  loading="lazy"
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
