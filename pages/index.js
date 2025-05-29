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


  return (
    <div>
      <Head>
        <title>GGL Móveis de Aço | Home</title>
        <meta
          name="description"
          content="Móveis de aço de alta qualidade, resistentes e com design moderno para seu ambiente profissional."
        />
      </Head>

      <Header />

      {isClient && (
        <main className="tw-mt-[110px] tw-mb-[130px] tw-max-w-[1920px] tw-mx-auto">
          {/* Banner principal */}
          <section>
            <div
              style={{
                backgroundImage: `url(/assets/banners/uepg-banner1.png)`,
              }}
              className="tw-bg-center tw-bg-no-repeat tw-w-full tw-bg-cover tw-relative"
            >
              <div className="tw-flex tw-items-center tw-justify-start tw-max-w-[1597px] tw-px-[5%] tw-mx-auto tw-w-full tw-py-[150px]">
                <div className="tw-flex tw-flex-col tw-text-white tw-z-[1]">
                  <h1 className="tw-text-[30px] md:tw-text-[40px] tw-mb-[20px]">GGL</h1>
                  <p className="tw-max-w-[300px] tw-w-full">
                    Móveis de excelente qualidade e resistência e perfeito
                    acabamento para harmonizar seu espaço.
                  </p>
                </div>
                <div className="tw-w-full tw-h-full tw-absolute tw-top-0 tw-left-0 tw-bg-[#0058C2] tw-opacity-[20%]"></div>
              </div>
            </div>
          </section>

          {/* Título das categorias */}
          <div className="tw-w-full tw-px-[20px]">
            <h1 className="tw-flex tw-justify-center tw-items-center tw-text-[24px] tw-text-darkBlue tw-my-[60px]">
              <hr className="tw-w-[30%] tw-bg-blue tw-rounded-[10px] tw-h-[3px] tw-mr-[30px]" />
              Conheça nossa linha de produtos
              <hr className="tw-w-[30%] tw-bg-blue tw-rounded-[10px] tw-h-[3px] tw-ml-[30px]" />
            </h1>
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
                  <img
                    src={category.image}
                    alt={category.name}
                    className="tw-h-[160px] tw-object-contain tw-w-full"
                  />
                  <div className="tw-mt-[20px]">
                    <h1 className="tw-text-[18px] tw-bg-darkBlue tw-text-white tw-py-[5px] tw-px-[10px]">
                      {category.name}
                    </h1>
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
            <h1 className="tw-text-[30px]">Nosso catálogo</h1>
            <div className="tw-flex tw-items-center tw-justify-around tw-mt-[40px] tw-flex-col md:tw-flex-row tw-gap-[20px]">
              <a href="/assets/catalogo.pdf" target="_blank">
                <img
                  src="/assets/banners/catalogo.png"
                  alt="Catálogo"
                  className="tw-max-w-[300px] tw-w-full"
                />
              </a>
              <div>
                <p className="tw-max-w-[360px] tw-w-full tw-mb-[30px]">
                  Baixe nosso catálogo para ter acesso a informações técnicas
                  sobre nossos produtos.
                </p>
                <a
                  href="/assets/catalogo.pdf"
                  target="_blank"
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
            <h1 className="tw-text-[30px]">Sobre nós</h1>
            <div className="tw-flex tw-items-center tw-justify-around tw-gap-[20px] tw-mt-[40px] tw-max-w-[1280px] tw-mx-auto tw-flex-col md:tw-flex-row">
              <div className="tw-w-full md:tw-w-[50%]">
                <p className="tw-mb-[30px]">
                  Em 15/02/1999 iniciamos a produção de Móveis fornecendo com
                  rapidez e qualidade toda linha de Aço aos clientes. Hoje
                  continuamos com este compromisso atuando numa área própria de
                  10.300m². Contamos com alta tecnologia na fabricação das
                  próprias matrizes e equipamentos utilizados para moldar e
                  desenvolver nossos móveis, que garante a precisão e o perfeito
                  acabamento refletindo em um diferencial na venda dos produtos
                  GGL. Toda atenção e respeito a nossos clientes resulta em
                  constante expansão com parcerias em vários estados do Brasil.
                </p>
              </div>
              <div className="tw-w-full md:tw-w-[50%]">
                <img
                  src="/assets/banners/empresa.jpg"
                  alt="Foto da empresa"
                  className="tw-w-full"
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
