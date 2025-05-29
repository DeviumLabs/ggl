import api from "../../services/api";

import Head from "next/head";
import Link from "next/link";

//Components
import Header from "../../components/header";
import Footer from "../../components/footer";
import Contact from "../../components/contact";

export async function getStaticProps() {
  const res = await api.get("/category?category=all");

  return {
    props: {
      categories: res.data,
    },
    revalidate: 5,
  };
}

export default function Produtos({ categories }) {
  return (
    <div>
      <Head>
        <title>GGL Móveis de Aço | Categorias</title>
        <meta
          name="description"
          content="Explore todas as categorias dos móveis de aço GGL. Produtos resistentes, modernos e ideais para ambientes corporativos, industriais e educacionais."
        />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <Header />

      <main className="tw-mt-[120px]">
        <section className="tw-px-[20px] tw-flex-col md:tw-flex-row tw-flex tw-items-center">
          <div className="tw-w-full">
            <h1 className="tw-text-[35px] tw-mb-[10px] tw-text-center">
              PRODUTOS
            </h1>
            <p className="tw-text-center">
              Produtos da mais excelente qualidade para sua empresa.
            </p>
          </div>
        </section>

        <section className="tw-px-[20px] tw-flex tw-justify-center tw-flex-wrap tw-gap-y-[80px] tw-gap-x-[40px] tw-mt-[80px] tw-mb-[100px]">
          {categories.categoryArray.map((category) => (
            <Link
              key={category.slug}
              href={`/produtos/${category.slug}?product=${category.products[0].slug}`}
              passHref
            >
              <a className="tw-max-w-[350px] tw-w-full tw-transition-transform tw-duration-300 hover:tw-scale-105">
                <img
                  src={category.image}
                  alt={category.name}
                  className="tw-h-[300px] tw-object-contain tw-w-full tw-transition-transform tw-duration-300"
                />
                <div className="tw-mt-[20px]">
                  <h1 className="tw-text-[22px]">{category.name}</h1>
                  <p>{category.description}</p>
                </div>
              </a>
            </Link>
          ))}
        </section>

        <Contact />
      </main>

      <Footer />
    </div>
  );
}
