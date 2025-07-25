import Link from "next/link";
import { Squash as Hamburger } from "hamburger-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setOpen] = useState(false);

  return (
    <header className="tw-flex tw-items-center tw-z-[400] tw-bg-white tw-w-[100%] tw-px-[20px] tw-fixed tw-top-0 tw-left-0 tw-justify-center tw-border-black tw-border-b-[1px] tw-h-[110px]">
      <div className="tw-flex tw-items-center tw-justify-between tw-max-w-[1280px] tw-w-full">
        <Link href="/" passHref>
          <a className="tw-flex" aria-label="Ir para a Home">
            <img
              src="/assets/icons/logo.svg"
              alt="Logo da GGL Móveis de Aço"
              className="tw-w-[100px]"
            />
          </a>
        </Link>

        <nav
          className="tw-fixed md:tw-static tw-top-[110px] tw-left-0 tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center md:tw-justify-end tw-flex-col md:tw-flex-row tw-gap-[30px] md:tw-bg-transparent tw-bg-blue tw-text-white md:tw-text-black tw-duration-200 tw-ease-out md:!tw-translate-x-0"
          style={{
            transform: !isOpen ? "translateX(100%)" : "translateX(0)",
          }}
          aria-label="Menu de navegação principal"
        >
          <Link href="/" passHref>
            <a className="hover:tw-text-blue tw-transition-[0.4s]" onClick={() => setOpen(false)}>
              Home
            </a>
          </Link>
          <Link href="/#sobre" passHref>
            <a className="hover:tw-text-blue tw-transition-[0.4s]" onClick={() => setOpen(false)}>
              Sobre
            </a>
          </Link>
          <Link href="/produtos" passHref>
            <a className="hover:tw-text-blue tw-transition-[0.4s]" onClick={() => setOpen(false)}>
              Produtos
            </a>
          </Link>
          <Link href="/#catalogo" passHref>
            <a className="hover:tw-text-blue tw-transition-[0.4s]" onClick={() => setOpen(false)}>
              Catálogo
            </a>
          </Link>
          <Link href="/videos" passHref>
            <a className="hover:tw-text-blue tw-transition-[0.4s]" onClick={() => setOpen(false)}>
              Vídeos
            </a>
          </Link>
          <Link href="#contato" passHref>
            <a className="hover:tw-text-blue tw-transition-[0.4s]" onClick={() => setOpen(false)}>
              Contato
            </a>
          </Link>

          <div className="tw-border-t md:tw-border-t-0 md:tw-border-l tw-border-white md:tw-border-black tw-pt-[20px] md:tw-pt-[0] md:tw-pl-[20px]">
            <a href="tel:+554230252200" className="tw-font-[300] hover:tw-underline">(42) 3025 2200</a>
            <br />
            <a href="tel:+554230255045" className="tw-font-[300] hover:tw-underline">(42) 3025 5045</a>
          </div>
        </nav>

        <div className="md:tw-hidden tw-block">
          <Hamburger toggled={isOpen} toggle={setOpen} label="Abrir menu" />
        </div>
      </div>
    </header>
  );
}
