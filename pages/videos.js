import { useEffect, useRef, useState } from "react";
import SeoHead from "../components/layout/SeoHead";
import ContactForm from "../components/contact/ContactForm";
import Reveal from "../components/animations/Reveal";
import { videoListJsonLd } from "../lib/seo/buildJsonLd";
import { trackVideoClick, trackVideoImpression, trackVideoPlay, trackViewVideoList } from "../lib/analytics/events";

const videos = [
  { name: "Montagem de Gôndola Central", id: "nPwJHr-P7ek", audience: "Comércio e varejo" },
  { name: "Montagem de Estante de Armazenamento", id: "Wr1YHpplRbE", audience: "Logística e estoque" },
  { name: "Montagem da Estante Biblioteca", id: "r7wG3CCayP0", audience: "Educação e acervos" },
  { name: "Estante Biblioteca com Sistema de Encaixe", id: "_l0TqQY2HPk", audience: "Instalação rápida" }
];

export default function Videos() {
  const impressionSent = useRef(new Set());
  const featured = videos[0];

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    trackViewVideoList({
      location: "videos_page",
      item_list_name: "Videos",
      items: videos.map((v, i) => ({
        item_id: v.id,
        item_name: v.name,
        index: i + 1
      }))
    });

    const cards = document.querySelectorAll(".js-video-card");
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const id = en.target.getAttribute("data-video-id");
          const name = en.target.getAttribute("data-video-name");
          if (!id || impressionSent.current.has(id)) return;

          impressionSent.current.add(id);
          trackVideoImpression({ video_id: id, video_name: name, visibility_threshold: 0.5 });
          observer.unobserve(en.target);
        });
      },
      { threshold: 0.5 }
    );

    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleVideoClick = (v) => trackVideoClick({ video_id: v.id, video_name: v.name, location: "videos_page" });

  const VideoCard = ({ v, index }) => {
    const [playing, setPlaying] = useState(false);
    const shapeClass = index % 2 === 0 ? "md:tw-rounded-[30px_20px_34px_18px]" : "md:tw-rounded-[20px_34px_18px_30px]";

    const play = () => {
      setPlaying(true);
      handleVideoClick(v);
      trackVideoPlay({ video_id: v.id, video_name: v.name, location: "videos_page" });
    };

    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        play();
      }
    };

    return (
      <div
        className={[
          "tw-group tw-relative tw-flex tw-flex-col tw-items-center tw-w-full sm:tw-w-[390px]",
          "tw-rounded-[26px] tw-border tw-border-slate-200/80 tw-bg-white/95 tw-p-[12px]",
          "tw-shadow-[0_18px_32px_-24px_rgba(15,23,42,0.65)] tw-transition-all tw-duration-300",
          "hover:-tw-translate-y-[5px] hover:tw-shadow-[0_28px_42px_-24px_rgba(15,23,42,0.55)]",
          shapeClass,
          "js-video-card"
        ].join(" ")}
        data-video-id={v.id}
        data-video-name={v.name}
      >
        <span
          aria-hidden="true"
          className="tw-absolute tw-left-[18px] tw-top-[14px] tw-z-[3] tw-inline-flex tw-items-center tw-rounded-full tw-bg-blue/10 tw-text-blue tw-text-[11px] tw-font-semibold tw-tracking-[0.08em] tw-px-[10px] tw-py-[4px]"
        >
          VÍDEO {index + 1}
        </span>

        <div className="tw-relative tw-overflow-hidden tw-rounded-[20px] tw-aspect-video tw-w-full">
          <div className="tw-absolute tw-inset-0 tw-bg-[linear-gradient(150deg,rgba(0,88,194,0.20)_0%,rgba(14,165,233,0.10)_45%,rgba(15,23,42,0.08)_100%)] tw-z-[1]" />
          {!playing ? (
            <button
              type="button"
              onClick={play}
              onKeyDown={onKey}
              className="tw-relative tw-z-[2] tw-w-full tw-h-full tw-block focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-blue focus-visible:tw-ring-offset-2"
              aria-label={`Reproduzir vídeo: ${v.name}`}
            >
              <img
                src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                alt={`Thumb do vídeo ${v.name}`}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span
                className="tw-absolute tw-top-1/2 tw-left-1/2 tw-rounded-full tw-bg-white/95 tw-w-16 tw-h-16 tw-flex tw-items-center tw-justify-center tw-text-blue tw-shadow-[0_14px_26px_-18px_rgba(15,23,42,0.7)] tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2 tw-transition tw-duration-300 group-hover:tw-scale-105"
                aria-hidden="true"
              >
                ▶
              </span>
            </button>
          ) : (
            <iframe
              className="tw-aspect-video tw-relative tw-z-[2] tw-top-0 tw-left-0 tw-w-full tw-h-full"
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

        <div className="tw-w-full tw-mt-[12px] tw-px-[2px]">
          <h2 className="tw-text-[18px] tw-leading-[1.25] tw-text-darkBlue tw-font-semibold">{v.name}</h2>
          <p className="tw-mt-[6px] tw-text-[14px] tw-text-slate-600">{v.audience}</p>
          {!playing ? (
            <button
              type="button"
              onClick={play}
              className="tw-inline-flex tw-items-center tw-gap-[8px] tw-mt-[10px] tw-rounded-full tw-bg-blue/10 tw-text-blue tw-font-medium tw-px-[12px] tw-py-[6px] hover:tw-bg-blue/15 tw-transition"
            >
              Assistir agora <span aria-hidden="true">→</span>
            </button>
          ) : null}
        </div>
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
        title="Vídeos de Montagem de Móveis de Aço | GGL"
        description="Tutoriais de montagem dos móveis de aço GGL para varejo, estoque e bibliotecas. Veja o passo a passo e agilize a instalação."
        canonical="https://www.gglmoveis.com.br/videos"
        image={`https://i.ytimg.com/vi/${videos[0].id}/hqdefault.jpg`}
        jsonLd={jsonLd}
      />

      <main className="tw-pt-[110px] tw-max-w-[1920px] tw-mx-auto tw-overflow-hidden tw-bg-[radial-gradient(circle_at_12%_18%,rgba(191,219,254,0.45),transparent_42%),radial-gradient(circle_at_85%_8%,rgba(125,211,252,0.24),transparent_40%),linear-gradient(180deg,#f8fafc_0%,#ffffff_56%,#f8fafc_100%)]">
        <section className="tw-px-[20px] tw-pt-[32px] tw-pb-[40px]">
          <Reveal direction="up">
            <div className="tw-max-w-[1240px] tw-mx-auto tw-grid tw-grid-cols-1 lg:tw-grid-cols-[1.12fr_0.88fr] tw-gap-[22px] tw-items-stretch">
              <article className="tw-relative tw-overflow-hidden tw-rounded-[34px] tw-bg-[linear-gradient(140deg,#0f172a_0%,#0058c2_60%,#1d4ed8_100%)] tw-text-white tw-p-[22px] md:tw-p-[34px] tw-shadow-[0_30px_44px_-28px_rgba(15,23,42,0.74)]">
                <div className="tw-absolute tw-right-[-70px] tw-top-[-80px] tw-w-[220px] tw-h-[220px] tw-rounded-full tw-bg-cyan-300/25 tw-blur-3xl" aria-hidden="true" />
                <div className="tw-absolute tw-left-[-60px] tw-bottom-[-90px] tw-w-[230px] tw-h-[230px] tw-rounded-full tw-bg-blue-300/20 tw-blur-3xl" aria-hidden="true" />

                <div className="tw-relative tw-z-[2]">
                  <small className="tw-inline-flex tw-items-center tw-gap-[8px] tw-rounded-full tw-bg-white/16 tw-px-[12px] tw-py-[5px] tw-tracking-[0.08em] tw-text-[12px] tw-font-semibold">
                    VÍDEOS GGL <span className="tw-w-[6px] tw-h-[6px] tw-rounded-full tw-bg-cyan-200" aria-hidden="true" />
                  </small>
                  <h1 className="tw-text-[30px] md:tw-text-[42px] tw-leading-[1.08] tw-mt-[14px] tw-font-semibold">Montagem guiada para instalar com segurança e rapidez</h1>
                  <p className="tw-max-w-[560px] tw-mt-[12px] tw-text-[16px] tw-leading-[1.5] tw-text-slate-100">
                    Conteúdos objetivos para reduzir dúvidas de instalação e garantir o melhor resultado no uso dos móveis de aço GGL.
                  </p>

                  <div className="tw-flex tw-flex-wrap tw-gap-[10px] tw-mt-[18px]">
                    <span className="tw-inline-flex tw-items-center tw-rounded-full tw-bg-white/14 tw-px-[12px] tw-py-[6px] tw-text-[13px]">Passo a passo visual</span>
                    <span className="tw-inline-flex tw-items-center tw-rounded-full tw-bg-white/14 tw-px-[12px] tw-py-[6px] tw-text-[13px]">Estrutura e encaixe</span>
                    <span className="tw-inline-flex tw-items-center tw-rounded-full tw-bg-white/14 tw-px-[12px] tw-py-[6px] tw-text-[13px]">Aplicação por ambiente</span>
                  </div>

                  <a
                    href="#lista-videos"
                    className="tw-inline-flex tw-items-center tw-gap-[8px] tw-rounded-full tw-bg-white tw-text-darkBlue tw-font-semibold tw-px-[18px] tw-py-[11px] tw-mt-[20px] hover:tw-bg-slate-100 tw-transition"
                  >
                    Ver vídeos <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </article>

              <article className="tw-relative tw-overflow-hidden tw-rounded-[34px] tw-border tw-border-slate-200/80 tw-bg-white/92 tw-p-[14px] tw-shadow-[0_22px_36px_-28px_rgba(15,23,42,0.6)]">
                <div className="tw-absolute tw-inset-0 tw-bg-[linear-gradient(155deg,rgba(0,88,194,0.12)_0%,rgba(14,165,233,0.08)_48%,rgba(255,255,255,0.95)_100%)]" aria-hidden="true" />
                <div className="tw-relative tw-z-[2]">
                  <p className="tw-text-[12px] tw-font-semibold tw-tracking-[0.08em] tw-text-blue">DESTAQUE</p>
                  <h2 className="tw-text-[23px] tw-leading-[1.15] tw-text-darkBlue tw-mt-[6px]">{featured.name}</h2>
                  <p className="tw-text-[14px] tw-text-slate-600 tw-mt-[6px]">
                    Assista ao tutorial mais acessado e acelere a montagem com orientações diretas da equipe GGL.
                  </p>

                  <a
                    href={`https://www.youtube.com/watch?v=${featured.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-group tw-block tw-mt-[12px]"
                    onClick={() => handleVideoClick(featured)}
                  >
                    <div className="tw-relative tw-overflow-hidden tw-rounded-[24px] tw-aspect-video tw-shadow-[0_20px_34px_-26px_rgba(15,23,42,0.75)]">
                      <img
                        src={`https://i.ytimg.com/vi/${featured.id}/hqdefault.jpg`}
                        alt={`Thumb do vídeo ${featured.name}`}
                        loading="lazy"
                        decoding="async"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <span className="tw-absolute tw-inset-0 tw-bg-[linear-gradient(to_top,rgba(15,23,42,0.5),transparent_50%)]" aria-hidden="true" />
                      <span className="tw-absolute tw-bottom-[12px] tw-left-[12px] tw-inline-flex tw-items-center tw-gap-[7px] tw-rounded-full tw-bg-white/92 tw-text-darkBlue tw-font-semibold tw-px-[11px] tw-py-[6px] tw-transition group-hover:tw-bg-white">
                        Assistir no YouTube <span aria-hidden="true">↗</span>
                      </span>
                    </div>
                  </a>
                </div>
              </article>
            </div>
          </Reveal>
        </section>

        <section className="tw-px-[20px] tw-pb-[92px]" id="lista-videos">
          <Reveal direction="up">
            <div className="tw-max-w-[1240px] tw-mx-auto tw-flex tw-flex-wrap tw-items-end tw-justify-between tw-gap-[12px]">
              <div>
                <small className="tw-text-blue tw-font-semibold tw-tracking-[0.08em]">BIBLIOTECA DE TUTORIAIS</small>
                <h2 className="tw-text-[30px] tw-leading-[1.1] tw-text-darkBlue tw-mt-[6px]">Escolha o vídeo ideal para sua instalação</h2>
              </div>
              <p className="tw-text-slate-600">{videos.length} vídeos disponíveis</p>
            </div>
          </Reveal>

          <div className="tw-max-w-[1240px] tw-mx-auto tw-pt-[20px] tw-flex tw-justify-center tw-items-start tw-flex-wrap tw-gap-[22px]">
            {videos.map((v, index) => (
              <Reveal key={v.id} direction="up" delay={Math.min(index * 90, 320)}>
                <VideoCard v={v} index={index} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="tw-px-[20px] tw-mt-[2px]">
          <Reveal direction="up">
            <ContactForm />
          </Reveal>
        </section>
      </main>
    </div>
  );
}
