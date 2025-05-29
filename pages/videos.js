import Head from "next/head";
import { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Contact from "../components/contact";

export default function Videos() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const query = location.hash;
    if (query !== "") {
      location.replace(`/${query}`);
    }
  }, []);

  const videos = [
    { name: "Montagem de Gondola Central", id: "nPwJHr-P7ek" },
    { name: "Montagem de Estante de Armazenamento", id: "Wr1YHpplRbE" },
    { name: "Montagem da Estante Biblioteca", id: "r7wG3CCayP0" },
    { name: "Estante Biblioteca com Sistema de Encaixe", id: "_l0TqQY2HPk" },
  ];

  return (
    <div>
      <Head>
        <title>GGL Móveis de Aço | Vídeos</title>
        <meta
          name="description"
          content="Assista aos vídeos de montagem dos móveis GGL, como estantes, bibliotecas e gôndolas."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      {isClient && (
        <main className="tw-mt-[110px] tw-mb-[130px] tw-max-w-[1920px] tw-mx-auto tw-pt-[30px]">
          <h1 className="tw-text-[30px] tw-text-center">Vídeos</h1>

          <section className="tw-px-[20px] tw-pt-[30px] tw-flex tw-justify-center tw-items-center tw-flex-wrap tw-gap-[40px] tw-mb-[120px] tw-max-w-[1280px] tw-w-full tw-mx-auto">
            {videos.map((v) => (
              <div
                key={v.id}
                className="tw-flex tw-flex-col tw-items-center tw-transition-transform tw-duration-300 hover:tw-scale-105"
              >
                <div className="tw-relative tw-overflow-hidden tw-aspect-video tw-w-full sm:tw-w-[400px]">
                  <iframe
                    className="tw-aspect-video tw-top-0 tw-left-0 tw-w-full tw-h-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="tw-mt-[10px] tw-text-center">{v.name}</p>
              </div>
            ))}
          </section>

          <Contact />
        </main>
      )}
      <Footer />
    </div>
  );
}
