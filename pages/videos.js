import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Contact from "../components/contact";

export default function Videos() {
  const [isClient, setIsClient] = useState(false);
  const impressionSent = useRef(new Set());

  const videos = [
    { name: "Montagem de Gondola Central", id: "nPwJHr-P7ek" },
    { name: "Montagem de Estante de Armazenamento", id: "Wr1YHpplRbE" },
    { name: "Montagem da Estante Biblioteca", id: "r7wG3CCayP0" },
    { name: "Estante Biblioteca com Sistema de Encaixe", id: "_l0TqQY2HPk" },
  ];

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);


  useEffect(() => {
    if (!isClient || typeof window === "undefined") return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "view_video_list",
      items: videos.map((v, i) => ({
        item_id: v.id,
        item_name: v.name,
        index: i + 1,
      })),
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const id = en.target.getAttribute("data-video-id");
          const name = en.target.getAttribute("data-video-name");
          if (!id || impressionSent.current.has(id)) return;

          impressionSent.current.add(id);
          window.dataLayer.push({
            event: "video_impression",
            video_id: id,
            video_name: name,
            visibility_threshold: 0.5,
          });
        });
      },
      { threshold: 0.5 }
    );

    document
      .querySelectorAll(".js-video-card")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isClient, videos]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Vídeos de Montagem GGL",
    "itemListElement": videos.map((v, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "VideoObject",
        "name": v.name,
        "description": `Vídeo institucional da GGL Móveis de Aço: ${v.name}.`,
        "thumbnailUrl": `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        "uploadDate": "2010-01-01",
        "embedUrl": `https://www.youtube.com/embed/${v.id}`,
        "publisher": {
          "@type": "Organization",
          "name": "GGL Móveis de Aço"
        }
      }
    }))
  };

  const handleVideoClick = (v) => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "video_click",
      video_id: v.id,
      video_name: v.name,
      location: "videos_page",
    });
  };

  return (
    <div>
      <Head>
        <title>GGL Móveis de Aço | Vídeos</title>
        <meta
          name="description"
          content="Assista aos vídeos de montagem dos móveis GGL, como estantes, bibliotecas e gôndolas."
        />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://www.gglmoveis.com.br/videos" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Header />

      {isClient && (
        <main className="tw-mt-[110px] tw-mb-[130px] tw-max-w-[1920px] tw-mx-auto tw-pt-[30px]">
          <h1 className="tw-text-[30px] tw-text-center">Vídeos</h1>

          <section className="tw-px-[20px] tw-pt-[30px] tw-flex tw-justify-center tw-items-center tw-flex-wrap tw-gap-[40px] tw-mb-[120px] tw-max-w-[1280px] tw-w-full tw-mx-auto">
            {videos.map((v) => (
              <div
                key={v.id}
                className="tw-flex tw-flex-col tw-items-center tw-transition-transform tw-duration-300 hover:tw-scale-105 js-video-card"
                data-video-id={v.id}
                data-video-name={v.name}
              >
                <div
                  className="tw-relative tw-overflow-hidden tw-aspect-video tw-w-full sm:tw-w-[400px]"
                  onClick={() => handleVideoClick(v)}
                >
                  <iframe
                    className="tw-aspect-video tw-top-0 tw-left-0 tw-w-full tw-h-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.name}
                    aria-label={`Vídeo de ${v.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <h2 className="tw-mt-[10px] tw-text-center tw-text-[18px]">
                  {v.name}
                </h2>
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