import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { dlPush } from "../lib/analytics/dataLayer";

export default function NotFoundPage() {
  useEffect(() => {
    dlPush("page_not_found", {
      page_path: typeof window !== "undefined" ? window.location.pathname : ""
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Página não encontrada | GGL Móveis de Aço</title>
        <meta
          name="description"
          content="A página que você tentou acessar não existe ou foi movida."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://www.gglmoveis.com.br/404" />
      </Head>

      <Header />

      <main className="tw-mt-[120px] tw-mb-[130px] tw-max-w-[1024px] tw-mx-auto tw-px-[20px] tw-min-h-[55vh] tw-flex tw-items-center">
        <div className="tw-w-full tw-text-center">
          <p className="tw-text-blue tw-font-semibold tw-tracking-widest">ERRO 404</p>
          <h1 className="tw-text-[34px] md:tw-text-[44px] tw-mt-[10px]">
            Página não encontrada
          </h1>
          <p className="tw-mt-[12px] tw-text-slate-600 tw-max-w-[680px] tw-mx-auto">
            O endereço pode ter sido digitado incorretamente, ou a página foi movida.
            Você pode voltar para a página inicial ou acessar nossos produtos.
          </p>

          <div className="tw-mt-[28px] tw-flex tw-flex-col sm:tw-flex-row tw-gap-[12px] tw-justify-center">
            <Link
              href="/"
              className="tw-inline-flex tw-justify-center tw-items-center tw-bg-blue tw-text-white tw-h-[46px] tw-px-[18px] tw-rounded-[8px] hover:tw-opacity-90 tw-transition"
            >
              Ir para a Home
            </Link>
            <Link
              href="/produtos"
              className="tw-inline-flex tw-justify-center tw-items-center tw-border tw-border-blue tw-text-blue tw-h-[46px] tw-px-[18px] tw-rounded-[8px] hover:tw-bg-blue hover:tw-text-white tw-transition"
            >
              Ver produtos
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
