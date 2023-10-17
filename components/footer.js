import { Fragment } from "react";

export default function Footer() {
  return (
    <Fragment>
      <footer className="tw-flex tw-flex-wrap tw-justify-start tw-items-start tw-gap-[40px] tw-bg-darkBlue tw-py-[50px] tw-px-[20px] tw-w-full">
        <div>
          <img src="/assets/icons/white-logo.svg" className="tw-w-[250px]" />
        </div>
        <div className="tw-px-[20px]">
          <h1 className="tw-text-[30px] tw-text-white tw-mb-[10px] ">
            Navegação
          </h1>
          <div className="tw-flex tw-flex-col">
            <a
              href="/"
              target="_blank"
              className="tw-mx-[30px] hover:tw-underline tw-transition-[0.4s] tw-text-white tw-mb-[6px]"
            >
              Home
            </a>
            <a
              href="/#sobre"
              target="_blank"
              className="tw-mx-[30px] hover:tw-underline tw-transition-[0.4s] tw-text-white tw-mb-[6px]"
            >
              Sobre
            </a>
            <a
              href="/produtos"
              target="_blank"
              className="tw-mx-[30px] hover:tw-underline tw-transition-[0.4s] tw-text-white tw-mb-[6px]"
            >
              Produtos
            </a>
            <a
              href="/#catalogo"
              target="_blank"
              className="tw-mx-[30px] hover:tw-underline tw-transition-[0.4s] tw-text-white tw-mb-[6px]"
            >
              Catálogo
            </a>
            <a
              href="/videos"
              target="_blank"
              className="tw-mx-[30px] hover:tw-underline tw-transition-[0.4s] tw-text-white tw-mb-[6px]"
            >
              Vídeos
            </a>
            <a
              href="#contato"
              target="_blank"
              className="tw-ml-[30px] hover:tw-underline tw-transition-[0.4s] tw-text-white tw-mb-[6px] "
            >
              Contato
            </a>
          </div>
        </div>
        <div>
          <div>
            <h3 className="tw-font-[300] tw-mb-[3px]">
              Horário de atendimento:
            </h3>
            <p className="tw-ml-[15px] tw-font-[300]">
              De segunda a quinta: 7h30 às 17h30
            </p>
            <p className="tw-ml-[15px] tw-font-[300]">Sexta: 7h30 às 16h30</p>
            <p className="tw-ml-[15px] tw-font-[300]">
              Finais de semana: fechado
            </p>
          </div>
          <div className="tw-my-[20px]">
            <h3 className="tw-font-[300] tw-mb-[3px]">Endereço:</h3>
            <p className="tw-ml-[15px] tw-font-[300]">
              R. Dr. Eugênio José Bocchi, 645 Boa Vista, Ponta Grossa - PR,
              84070-430
            </p>
          </div>
          <div className="tw-my-[20px]">
            <h3 className="tw-font-[300] tw-mb-[3px]">Contato:</h3>
            <p className="tw-ml-[15px] tw-font-[300]">(42) 3025 2200</p>
            <p className="tw-ml-[15px] tw-font-[300]">(42) 3025 5045</p>
          </div>
          <div>
            <h3 className="tw-font-[300] tw-mb-[5px]">Redes sociais:</h3>
            <div className="tw-flex">
              <div className="tw-bg-white tw-w-[50px] tw-h-[50px] tw-rounded-[50%] tw-p-[5px] tw-mr-[15px] tw-flex tw-items-center tw-justify-center">
                <a
                  href=""
                  target="_blank"
                  className="tw-bg-white tw-rounded-[50%]"
                >
                  <img src="/assets/icons/instagram.svg" />
                </a>
              </div>
              <div className="tw-bg-white tw-w-[50px] tw-h-[50px] tw-rounded-[50%] tw-p-[5px] tw-mr-[15px]">
                <a
                  href="https://www.youtube.com/@GGLmoveis"
                  target="_blank"
                  className="tw-bg-white "
                >
                  <img src="/assets/icons/youtube.svg" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="tw-bg-darkBlue tw-text-center tw-border-white tw-border-t-[1px] tw-py-[5px] tw-px-[20px]">
        <a
          href="https://www.devlara.com.br/"
          target="_blank"
          className="tw-text-white hover:tw-underline"
        >
          &copy; 2022 GGL Móveis. Todos os direitos reservado | Desenvolvido por
          <strong> Devlara</strong>
        </a>
      </div>
    </Fragment>
  );
}
