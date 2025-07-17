import { Fragment } from "react";
import Whatsapp from "./whatsapp";

export default function Footer() {
  return (
    <Fragment>
      {/* <Whatsapp /> */}
      <footer className="tw-bg-darkBlue tw-pt-[30px] tw-pb-[10px] tw-px-[20px] tw-w-full">
        <div className="tw-flex tw-flex-wrap tw-justify-start tw-items-start tw-gap-[40px]">
          <div>
            <img
              src="/assets/icons/white-logo.svg"
              alt="Logo GGL"
              className="tw-w-[250px]"
            />
          </div>

          <nav
            aria-label="Rodapé - Navegação"
            className="tw-px-[20px]"
          >
            <h2 className="tw-text-[30px] tw-text-white tw-mb-[10px]">
              Navegação
            </h2>
            <ul className="tw-flex tw-flex-col">
              {[
                { label: "Home", href: "/" },
                { label: "Sobre", href: "/#sobre" },
                { label: "Produtos", href: "/produtos" },
                { label: "Catálogo", href: "/#catalogo" },
                { label: "Vídeos", href: "/videos" },
                { label: "Contato", href: "#contato" },
              ].map((link) => (
                <li key={link.href} className="tw-mb-[6px]">
                  <a
                    href={link.href}
                    className="tw-text-white hover:tw-underline tw-transition-[0.4s]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <section className="tw-mb-[20px]">
              <h3 className="tw-font-[300] tw-text-white">Horário de atendimento:</h3>
              <p className="tw-ml-[15px] tw-font-[300] tw-text-white">
                Segunda a quinta: 7h30 às 17h30
              </p>
              <p className="tw-ml-[15px] tw-font-[300] tw-text-white">
                Sexta: 7h30 às 16h30
              </p>
              <p className="tw-ml-[15px] tw-font-[300] tw-text-white">
                Finais de semana: fechado
              </p>
            </section>

            <address className="tw-not-italic tw-text-white tw-font-[300] tw-ml-[15px]">
              <strong>Endereço:</strong><br />
              R. Dr. Eugênio José Bocchi, 645<br />
              Boa Vista, Ponta Grossa - PR<br />
              84070-430
            </address>

            <div className="tw-my-[20px]">
              <h3 className="tw-font-[300] tw-mb-[3px] tw-text-white">Contato:</h3>
              <p className="tw-ml-[15px] tw-font-[300]">
                <a href="tel:+554230252200" className="hover:tw-underline">
                  (42) 3025 2200
                </a>
              </p>
              <p className="tw-ml-[15px] tw-font-[300]">
                <a href="tel:+554230255045" className="hover:tw-underline">
                  (42) 3025 5045
                </a>
              </p>
            </div>

            <div>
              <h3 className="tw-font-[300] tw-mb-[5px] tw-text-white">Redes sociais:</h3>
              <div className="tw-flex">
                <a
                  href="https://www.instagram.com/gglmoveisdeaco/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram GGL"
                  className="tw-bg-white tw-w-[50px] tw-h-[50px] tw-rounded-[50%] tw-p-[5px] tw-mr-[15px] tw-flex tw-items-center tw-justify-center tw-transition-transform tw-duration-300 hover:tw-scale-110"
                >
                  <img src="/assets/icons/instagram.svg" alt="Instagram GGL" />
                </a>
                <a
                  href="https://www.youtube.com/@GGLmoveis"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube GGL"
                  className="tw-bg-white tw-w-[50px] tw-h-[50px] tw-rounded-[50%] tw-p-[5px] tw-mr-[15px] tw-flex tw-items-center tw-justify-center tw-transition-transform tw-duration-300 hover:tw-scale-110"
                >
                  <img src="/assets/icons/youtube.svg" alt="YouTube GGL" />
                </a>
              </div>
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
