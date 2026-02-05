import { useEffect, useRef, useState } from "react";
import SeoHead from "../components/layout/SeoHead";
import ContactForm from "../components/contact/ContactForm";
import { dlPush } from "../lib/analytics/dataLayer";
import { videoListJsonLd } from "../lib/seo/buildJsonLd";

export default function Videos() {
  const [isClient, setIsClient] = useState(false);
  const impressionSent = useRef(new Set());

  const videos = [
    { name: "Montagem de Gondola Central", id: "nPwJHr-P7ek" },
    { name: "Montagem de Estante de Armazenamento", id: "Wr1YHpplRbE" },
    { name: "Montagem da Estante Biblioteca", id: "r7wG3CCayP0" },
    { name: "Estante Biblioteca com Sistema de Encaixe", id: "_l0TqQY2HPk" }
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
    if (!isClient) return;

    dlPush("view_video_list", {
      items: videos.map((v, i) => ({
        item_id: v.id,
        item_name: v.name,
        index: i + 1
      }))
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const id = en.target.getAttribute("data-video-id");
          const name = en.target.getAttribute("data-video-name");
          if (!id || impressionSent.current.has(id)) return;

          impressionSent.current.add(id);
          dlPush("video_impression", { video_id: id, video_name: name, visibility_threshold: 0.5 });
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll(".js-video-card").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isClient]);

  const handleVideoClick = (v) => dlPush("video_click", { video_id: v.id, video_name: v.name, location: "videos_page" });

  const VideoCard = ({ v }) => {
    const [playing, setPlaying] = useState(false);

    const play = () => {
      setPlaying(true);
      handleVideoClick(v);
      dlPush("video_play", { video_id: v.id, video_name: v.name, location: "videos_page" });
    };

    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        play();
      }
    };

    return (
      <div className="tw-flex tw-flex-col tw-items-center tw-transition-transform tw-duration-300 hover:tw-scale-105 js-video-card" data-video-id={v.id} data-video-name={v.name}>
        <div className="tw-relative tw-overflow-hidden tw-aspect-video tw-w-full sm:tw-w-[400px]">
          {!playing ? (
            <button type="button" onClick={play} onKeyDown={onKey} className="tw-relative tw-w-full tw-h-full tw-block" aria-label={`Reproduzir vídeo: ${v.name}`}>
              <img
                src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                alt={`Thumb do vídeo ${v.name}`}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span
                className="tw-absolute tw-top-1/2 tw-left-1/2 tw-rounded-full tw-bg-white tw-w-16 tw-h-16 tw-flex tw-items-center tw-justify-center tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2"
                aria-hidden="true"
              >
                ▶
              </span>
            </button>
          ) : (
            <iframe
              className="tw-aspect-video tw-top-0 tw-left-0 tw-w-full tw-h-full"
              src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
              title={v.name}
              aria-label={`Vídeo de ${v.name}`}
              frameBorder="0"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
        </div>
        <h2 className="tw-mt-[10px] tw-text-center tw-text-[18px]">{v.name}</h2>
      </div>
    );
  };

  const jsonLd = videoListJsonLd({
    name: "Vídeos de Montagem GGL",
    items: videos.map((v) => ({ id: v.id, name: v.name }))
  });

  return (
    <div>
      <SeoHead
        title="GGL Móveis de Aço | Vídeos"
        description="Assista aos vídeos de montagem dos móveis GGL, como estantes, bibliotecas e gôndolas."
        canonical="https://www.gglmoveis.com.br/videos"
        jsonLd={jsonLd}
      />

      {isClient ? (
        <main className="tw-mt-[110px] tw-mb-[130px] tw-max-w-[1920px] tw-mx-auto tw-pt-[30px]">
          <h1 className="tw-text-[30px] tw-text-center">Vídeos</h1>

          <section className="tw-px-[20px] tw-pt-[30px] tw-flex tw-justify-center tw-items-center tw-flex-wrap tw-gap-[40px] tw-mb-[120px] tw-max-w-[1280px] tw-w-full tw-mx-auto">
            {videos.map((v) => (
              <VideoCard key={v.id} v={v} />
            ))}
          </section>

          <ContactForm />
        </main>
      ) : null}
    </div>
  );
}
