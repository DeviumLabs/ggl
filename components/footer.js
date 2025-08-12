import { Fragment } from "react";
import Image from "next/image";
import Whatsapp from "./whatsapp";

export default function Footer() {
  const sendFooterNavEvent = (label, url) => {
    if (window.gtag) {
      window.gtag("event", "navigation_click", {
        location: "footer",
        link_text: label,
        link_url: url,
      });
    }
  };

  const sendFooterCallEvent = (number) => {
    if (window.gtag) {
      window.gtag("event", "click_to_call", {
        location: "footer",
        phone_number: number,
      });
    }
  };

  const sendSocialClickEvent = (platform, url) => {
    if (window.gtag) {
      window.gtag("event", "social_click", {
        location: "footer",
        platform,
        link_url: url,
      });
    }
  };

  return (
    <Fragment>
      {/* <Whatsapp /> */}
      <footer className="tw-bg-darkBlue tw-pt-[30px] tw-pb-[10px] tw-px-[20px] tw-w-full">
        <div className="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-[40px] tw-max-w-[1400px] tw-mx-auto">
          <div className="tw-flex tw-justify-start">
            <Image src="/assets/icons/white-logo.svg" alt="Logo GGL" width={250} height={80} />
          </div>

          <div>
            <h2 className="tw-text-[24px] tw-text-white tw-mb-[10px]">Navegação</h2>
            <ul className="tw-flex tw-flex-col tw-gap-[4px]">
              {["Home", "Sobre", "Produtos", "Catálogo", "Vídeos", "Contato"].map((label, i) => {
                const urls = ["/", "/#sobre", "/produtos", "/#catalogo", "/videos", "#contato"];
                return (
                  <li key={i}>
                    <a
                      href={urls[i]}
                      className="tw-text-white hover:tw-underline"
                      onClick={() => sendFooterNavEvent(label, urls[i])}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="tw-mb-[10px]">
              <h3 className="tw-text-white tw-font-medium">Horário de atendimento:</h3>
              <p className="tw-text-white tw-text-sm">Segunda a quinta: 7h30 às 17h30</p>
              <p className="tw-text-white tw-text-sm">Sexta: 7h30 às 16h30</p>
              <p className="tw-text-white tw-text-sm">Finais de semana: fechado</p>
            </div>

            <div className="tw-mb-[10px]">
              <h3 className="tw-text-white tw-font-medium">Endereço:</h3>
              <p className="tw-text-white tw-text-sm">
                R. Dr. Eugênio José Bocchi, 645<br />
                Boa Vista, Ponta Grossa - PR<br />
                84070-430
              </p>
            </div>

            <div className="tw-mb-[10px]">
              <h3 className="tw-text-white tw-font-medium">Contato:</h3>
              <p className="tw-text-white tw-text-sm">
                <a
                  href="tel:+554230252200"
                  className="hover:tw-underline"
                  onClick={() => sendFooterCallEvent("+554230252200")}
                >
                  (42) 3025 2200
                </a>

                <a
                  href="tel:+554230255045"
                  className="hover:tw-underline"
                  onClick={() => sendFooterCallEvent("+554230255045")}
                >
                  (42) 3025 5045
                </a>
              </p>
            </div>

            <div className="tw-flex tw-gap-[10px] tw-mt-[10px]">
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
          </div>
        </div>

        <div className="tw-text-center tw-border-white tw-border-t-[1px] tw-mt-[40px] tw-pt-[5px]">
          <a
            href="https://www.devlara.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="tw-text-white hover:tw-underline"
          >
            &copy; {new Date().getFullYear()} GGL Móveis. Todos os direitos reservados | Desenvolvido por <strong>Devlara</strong>
          </a>
        </div>
      </footer>
    </Fragment>
  );
}