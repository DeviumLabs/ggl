import Link from "next/link";
import { Squash as Hamburger } from "hamburger-react";
import { useEffect, useRef, useState } from "react";
import { dlPush } from "../lib/analytics/dataLayer";

export default function Header() {
  const [isOpen, setOpen] = useState(false);
  const navRef = useRef(null);

  const sendNavEvent = (label, url) => dlPush("navigation_click", { location: "header", link_text: label, link_url: url });
  const sendLogoEvent = () => dlPush("logo_click", { location: "header" });
  const sendCallEvent = (number) => dlPush("click_to_call", { location: "header", phone_number: number });

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    const focusTimer = setTimeout(() => {
      const firstLink = navRef.current?.querySelector("a");
      if (firstLink) firstLink.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="tw-flex tw-items-center tw-z-[400] tw-bg-white tw-w-[100%] tw-px-[20px] tw-fixed tw-top-0 tw-left-0 tw-justify-center tw-border-black tw-border-b-[1px] tw-h-[110px]">
      <div className="tw-flex tw-items-center tw-justify-between tw-max-w-[1280px] tw-w-full">
        <Link
          href="/"
          aria-label="Ir para a Home"
          className="tw-relative tw-w-[140px] md:tw-w-[220px] tw-h-[50px] md:tw-h-[70px]"
          onClick={() => {
            sendLogoEvent();
            setOpen(false);
          }}
        >
          <img
            src="/assets/icons/logo.svg"
            alt="Logo da GGL Móveis de Aço"
            width={220}
            height={70}
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Link>

        {isOpen ? (
          <button
            type="button"
            className="md:tw-hidden tw-fixed tw-top-[110px] tw-left-0 tw-right-0 tw-bottom-0 tw-bg-black/45"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          />
        ) : null}

        <nav
          ref={navRef}
          id="primary-navigation"
          className="tw-fixed md:tw-static tw-top-[110px] tw-left-0 tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center md:tw-justify-end tw-flex-col md:tw-flex-row tw-gap-[30px] md:tw-bg-transparent tw-bg-blue tw-text-white md:tw-text-black tw-duration-200 tw-ease-out md:!tw-translate-x-0"
          style={{ transform: !isOpen ? "translateX(100%)" : "translateX(0)" }}
          aria-label="Menu de navegação principal"
        >
          <Link
            href="/"
            className="hover:tw-text-blue tw-transition-[0.4s]"
            onClick={() => {
              sendNavEvent("Home", "/");
              setOpen(false);
            }}
          >
            Home
          </Link>

          <Link
            href="/#sobre"
            className="hover:tw-text-blue tw-transition-[0.4s]"
            onClick={() => {
              sendNavEvent("Sobre", "/#sobre");
              setOpen(false);
            }}
          >
            Sobre
          </Link>

          <Link
            href="/produtos"
            className="hover:tw-text-blue tw-transition-[0.4s]"
            onClick={() => {
              sendNavEvent("Produtos", "/produtos");
              setOpen(false);
            }}
          >
            Produtos
          </Link>

          <Link
            href="/#catalogo"
            className="hover:tw-text-blue tw-transition-[0.4s]"
            onClick={() => {
              sendNavEvent("Catálogo", "/#catalogo");
              setOpen(false);
            }}
          >
            Catálogo
          </Link>

          <Link
            href="/videos"
            className="hover:tw-text-blue tw-transition-[0.4s]"
            onClick={() => {
              sendNavEvent("Vídeos", "/videos");
              setOpen(false);
            }}
          >
            Vídeos
          </Link>

          <Link
            href="#contato"
            className="hover:tw-text-blue tw-transition-[0.4s]"
            onClick={() => {
              sendNavEvent("Contato", "#contato");
              setOpen(false);
            }}
          >
            Contato
          </Link>

          <div className="tw-border-t md:tw-border-t-0 md:tw-border-l tw-border-white md:tw-border-black tw-pt-[20px] md:tw-pt-[0] md:tw-pl-[20px]">
            <a href="tel:+554230252200" className="tw-font-[300] hover:tw-underline" onClick={() => sendCallEvent("+554230252200")}>
              (42) 3025 2200
            </a>
            <br />
            <a href="tel:+554230255045" className="tw-font-[300] hover:tw-underline" onClick={() => sendCallEvent("+554230255045")}>
              (42) 3025 5045
            </a>
          </div>
        </nav>

        <div className="md:tw-hidden tw-block">
          <Hamburger toggled={isOpen} toggle={setOpen} label={isOpen ? "Fechar menu" : "Abrir menu"} aria-controls="primary-navigation" />
        </div>
      </div>
    </header>
  );
}
