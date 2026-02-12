import { Fragment, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackClickToCall, trackNavigationClick, trackSocialClick } from "../lib/analytics/events";

export default function Footer() {
  const sendFooterNavEvent = useCallback((label, url) => {
    trackNavigationClick({ location: "footer", link_text: label, link_url: url });
  }, []);

  const sendFooterCallEvent = useCallback((number) => {
    trackClickToCall({ location: "footer", phone_number: number });
  }, []);

  const sendSocialClickEvent = useCallback((platform, url) => {
    trackSocialClick({ location: "footer", platform, link_url: url });
  }, []);

  const navItems = useMemo(
    () => [
      { label: "Home", url: "/" },
      { label: "Sobre", url: "/#sobre" },
      { label: "Produtos", url: "/produtos" },
      { label: "Catálogo", url: "/#catalogo" },
      { label: "Vídeos", url: "/videos" },
      { label: "Contato", url: "#contato" }
    ],
    []
  );

  return (
    <Fragment>
      <footer className="tw-relative tw-overflow-hidden tw-bg-[linear-gradient(165deg,#0f172a_0%,#0058c2_56%,#1e3a8a_100%)] tw-pt-[48px] tw-pb-[12px] tw-px-[20px] tw-w-full">
        <div className="tw-absolute tw-left-[-130px] tw-top-[-130px] tw-w-[320px] tw-h-[320px] tw-rounded-full tw-bg-cyan-300/20 tw-blur-3xl" aria-hidden="true" />
        <div className="tw-absolute tw-right-[-110px] tw-bottom-[-140px] tw-w-[360px] tw-h-[360px] tw-rounded-full tw-bg-blue-300/20 tw-blur-3xl" aria-hidden="true" />

        <div className="tw-relative tw-z-[2] tw-max-w-[1400px] tw-mx-auto">
          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-[1.25fr_0.8fr_1fr] tw-gap-[18px]">
            <section className="tw-rounded-[30px] tw-border tw-border-white/20 tw-bg-white/10 tw-backdrop-blur-sm tw-p-[20px]">
              <div className="tw-w-[220px] sm:tw-w-[280px]">
                <Image
                  src="/assets/icons/white-logo.svg"
                  alt="Logo GGL"
                  width={400}
                  height={128}
                  sizes="(max-width:640px) 220px, 280px"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>

              <p className="tw-text-slate-100 tw-mt-[14px] tw-max-w-[520px]">
                Estruturas em aço para ambientes corporativos que precisam de durabilidade, organização e acabamento profissional.
              </p>

              <div className="tw-flex tw-flex-wrap tw-gap-[10px] tw-mt-[18px]">
                <Link
                  href="/produtos"
                  className="tw-inline-flex tw-items-center tw-rounded-full tw-bg-white tw-text-darkBlue tw-font-semibold tw-px-[14px] tw-py-[8px] hover:tw-bg-slate-100 tw-transition"
                  onClick={() => sendFooterNavEvent("Produtos", "/produtos")}
                >
                  Ver produtos
                </Link>
                <Link
                  href="#contato"
                  className="tw-inline-flex tw-items-center tw-rounded-full tw-border tw-border-white/45 tw-text-white tw-font-medium tw-px-[14px] tw-py-[8px] hover:tw-bg-white/10 tw-transition"
                  onClick={() => sendFooterNavEvent("Contato", "#contato")}
                >
                  Falar com a GGL
                </Link>
              </div>
            </section>

            <section className="tw-rounded-[30px] tw-border tw-border-white/20 tw-bg-white/10 tw-backdrop-blur-sm tw-p-[20px]">
              <h2 className="tw-text-[21px] tw-text-white tw-mb-[10px] tw-font-semibold">Navegação</h2>
              <ul className="tw-flex tw-flex-col tw-gap-[7px]">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.url}
                      className="tw-inline-flex tw-items-center tw-rounded-full tw-text-white tw-px-[10px] tw-py-[6px] hover:tw-bg-white/12 tw-transition"
                      onClick={() => sendFooterNavEvent(item.label, item.url)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="tw-rounded-[30px] tw-border tw-border-white/20 tw-bg-white/10 tw-backdrop-blur-sm tw-p-[20px]">
              <div className="tw-mb-[12px]">
                <h3 className="tw-text-white tw-font-semibold">Horário de atendimento</h3>
                <p className="tw-text-slate-100 tw-text-sm">Segunda a quinta: 7h30 às 17h30</p>
                <p className="tw-text-slate-100 tw-text-sm">Sexta: 7h30 às 16h30</p>
                <p className="tw-text-slate-100 tw-text-sm">Finais de semana: fechado</p>
              </div>

              <address className="tw-mb-[12px] tw-not-italic">
                <h3 className="tw-text-white tw-font-semibold">Endereço</h3>
                <p className="tw-text-slate-100 tw-text-sm">
                  R. Dr. Eugênio José Bocchi, 645
                  <br />
                  Boa Vista, Ponta Grossa - PR
                  <br />
                  84070-430
                </p>
              </address>

              <address className="tw-mb-[12px] tw-not-italic">
                <h3 className="tw-text-white tw-font-semibold">Contato</h3>
                <p className="tw-text-slate-100 tw-text-sm tw-flex tw-flex-col tw-gap-[2px]">
                  <a href="tel:+554230252200" className="hover:tw-underline" onClick={() => sendFooterCallEvent("+554230252200")}>
                    (42) 3025 2200
                  </a>
                  <a href="tel:+554230255045" className="hover:tw-underline" onClick={() => sendFooterCallEvent("+554230255045")}>
                    (42) 3025 5045
                  </a>
                </p>
              </address>

              <div className="tw-flex tw-gap-[10px] tw-mt-[6px]">
                <a
                  href="https://www.instagram.com/gglmoveisdeaco/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram GGL"
                  className="tw-bg-white tw-w-[40px] tw-h-[40px] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-transition-transform tw-duration-300 hover:tw-scale-110"
                  onClick={() => sendSocialClickEvent("instagram", "https://www.instagram.com/gglmoveisdeaco/")}
                >
                  <Image src="/assets/icons/instagram.svg" alt="Instagram GGL" width={24} height={24} />
                </a>

                <a
                  href="https://www.youtube.com/@GGLmoveis"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube GGL"
                  className="tw-bg-white tw-w-[40px] tw-h-[40px] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-transition-transform tw-duration-300 hover:tw-scale-110"
                  onClick={() => sendSocialClickEvent("youtube", "https://www.youtube.com/@GGLmoveis")}
                >
                  <Image src="/assets/icons/youtube.svg" alt="YouTube GGL" width={24} height={24} />
                </a>

                <a
                  href="https://www.facebook.com/gglmoveis/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook GGL"
                  className="tw-bg-white tw-w-[40px] tw-h-[40px] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-transition-transform tw-duration-300 hover:tw-scale-110"
                  onClick={() => sendSocialClickEvent("facebook", "https://www.facebook.com/gglmoveis/")}
                >
                  <Image src="/assets/icons/facebook.svg" alt="Facebook GGL" width={24} height={20} />
                </a>
              </div>
            </section>
          </div>

          <div className="tw-text-center tw-border-white/30 tw-border-t tw-mt-[30px] tw-pt-[8px]">
            <a href="https://www.devlara.com.br/" target="_blank" rel="noopener noreferrer" className="tw-text-slate-100 hover:tw-underline">
              &copy; {new Date().getFullYear()} GGL Móveis. Todos os direitos reservados | Desenvolvido por <strong>Devlara</strong>
            </a>
          </div>
        </div>
      </footer>
    </Fragment>
  );
}
