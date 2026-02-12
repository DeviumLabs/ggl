import Link from "next/link";
import { Squash as Hamburger } from "hamburger-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { trackClickToCall, trackLogoClick, trackNavigationClick } from "../lib/analytics/events";

export default function Header() {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const navRef = useRef(null);

  const sendNavEvent = (label, url) => trackNavigationClick({ location: "header", link_text: label, link_url: url });
  const sendLogoEvent = () => trackLogoClick({ location: "header" });
  const sendCallEvent = (number) => trackClickToCall({ location: "header", phone_number: number });

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

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Sobre", href: "/#sobre" },
    { label: "Produtos", href: "/produtos" },
    { label: "Catálogo", href: "/#catalogo" },
    { label: "Vídeos", href: "/videos" },
    { label: "Contato", href: "#contato" }
  ];

  const isActiveRoute = (href) => {
    if (href === "/produtos") return router.asPath.startsWith("/produtos");
    if (href === "/videos") return router.asPath.startsWith("/videos");
    if (href === "/") return router.asPath === "/";
    return false;
  };

  return (
    <header className="tw-fixed tw-top-0 tw-left-0 tw-z-[400] tw-w-full tw-px-[14px] md:tw-px-[20px] tw-pt-[10px]">
      <div className="tw-flex tw-items-center tw-justify-between tw-max-w-[1280px] tw-w-full tw-h-[94px] tw-mx-auto tw-rounded-[24px] tw-border tw-border-slate-300/90 tw-bg-white/97 tw-backdrop-blur-md tw-px-[14px] md:tw-px-[20px] tw-shadow-[0_16px_30px_-22px_rgba(15,23,42,0.55)]">
        <Link
          href="/"
          aria-label="Ir para a Home"
          className="tw-flex tw-items-center tw-justify-center tw-shrink-0 tw-overflow-visible tw-w-[84px] md:tw-w-[122px] tw-h-[56px] md:tw-h-[72px]"
          onClick={() => {
            sendLogoEvent();
            setOpen(false);
          }}
        >
          <img
            src="/assets/icons/logo.png"
            alt="Logo da GGL Móveis de Aço"
            width={119}
            height={91}
            decoding="async"
            className="tw-h-full tw-w-full tw-object-contain tw-origin-center tw-scale-[1.9] md:tw-scale-[1.75]"
          />
        </Link>

        {isOpen ? (
          <button
            type="button"
            className="md:tw-hidden tw-fixed tw-inset-0 tw-z-[405] tw-bg-slate-900/45 tw-backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          />
        ) : null}

        <div
          ref={navRef}
          id="primary-navigation"
          className={[
            "md:tw-hidden tw-fixed tw-z-[410] tw-inset-x-[12px] tw-top-[108px] tw-max-h-[calc(100vh-120px)] tw-overflow-y-auto",
            "tw-rounded-[24px] tw-border tw-border-white/20 tw-bg-[linear-gradient(160deg,#0f172a_0%,#0058c2_58%,#0369a1_100%)] tw-text-white",
            "tw-px-[16px] tw-py-[16px] tw-shadow-[0_24px_42px_-26px_rgba(15,23,42,0.78)] tw-transition-all tw-duration-300",
            isOpen ? "tw-opacity-100 tw-translate-y-0 tw-pointer-events-auto" : "tw-opacity-0 -tw-translate-y-[8px] tw-pointer-events-none"
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          aria-hidden={!isOpen}
        >
          <div className="tw-flex tw-items-center tw-justify-between tw-gap-[8px]">
            <span className="tw-text-[13px] tw-font-semibold tw-tracking-[0.08em] tw-text-white/85">NAVEGAÇÃO</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="tw-inline-flex tw-items-center tw-justify-center tw-w-[34px] tw-h-[34px] tw-rounded-[10px] tw-bg-white/12 focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-white/80"
              aria-label="Fechar menu"
            >
              ✕
            </button>
          </div>

          <div className="tw-mt-[10px] tw-grid tw-grid-cols-1 tw-gap-[8px]">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={[
                    "tw-inline-flex tw-w-full tw-items-center tw-justify-center tw-text-center tw-min-h-[44px] tw-rounded-full tw-px-[12px] tw-py-[9px] tw-text-[15px] tw-font-medium tw-leading-none tw-tracking-[0.01em] tw-transition",
                    "hover:tw-bg-white/16",
                    isActive ? "tw-bg-white/18 tw-font-semibold tw-shadow-[0_10px_18px_-14px_rgba(0,88,194,0.9)]" : ""
                  ].join(" ")}
                  onClick={() => {
                    sendNavEvent(item.label, item.href);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="tw-mt-[10px] tw-border-t tw-border-white/30 tw-pt-[10px] tw-flex tw-flex-col tw-gap-[2px]">
            <a href="tel:+554230252200" className="tw-font-[500] tw-text-[15px] tw-text-white md:tw-text-slate-700 md:tw-text-[14px] hover:tw-underline" onClick={() => sendCallEvent("+554230252200")}>
              (42) 3025 2200
            </a>
            <a href="tel:+554230255045" className="tw-font-[500] tw-text-[15px] tw-text-white md:tw-text-slate-700 md:tw-text-[14px] hover:tw-underline" onClick={() => sendCallEvent("+554230255045")}>
              (42) 3025 5045
            </a>
          </div>
        </div>

        <nav
          className="tw-hidden md:tw-flex md:tw-items-center md:tw-gap-[6px]"
          aria-label="Menu de navegação principal"
        >
          <div className="md:tw-flex-row md:tw-items-center md:tw-gap-[2px] md:tw-rounded-full md:tw-bg-slate-100/95 md:tw-p-[4px] tw-hidden md:tw-flex">
            {navItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={[
                    "tw-rounded-full tw-px-[14px] tw-py-[9px] tw-text-[15px] tw-font-medium tw-leading-none tw-tracking-[0.01em] tw-transition",
                    "md:tw-font-medium md:tw-text-darkBlue",
                    "md:hover:tw-bg-blue/15 md:hover:tw-text-darkBlue",
                    isActive ? "md:tw-bg-blue md:tw-text-white md:tw-font-semibold md:tw-shadow-[0_10px_18px_-14px_rgba(0,88,194,0.9)]" : ""
                  ].join(" ")}
                  onClick={() => {
                    sendNavEvent(item.label, item.href);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="tw-hidden md:tw-flex md:tw-border-l md:tw-border-slate-300 md:tw-pl-[14px] md:tw-flex-col md:tw-gap-[2px] md:tw-ml-[2px] md:tw-rounded-full md:tw-bg-slate-100/95 md:tw-pr-[12px] md:tw-py-[7px]">
            <a href="tel:+554230252200" className="tw-font-[500] md:tw-text-slate-700 md:tw-text-[14px] hover:tw-underline" onClick={() => sendCallEvent("+554230252200")}>
              (42) 3025 2200
            </a>
            <a href="tel:+554230255045" className="tw-font-[500] md:tw-text-slate-700 md:tw-text-[14px] hover:tw-underline" onClick={() => sendCallEvent("+554230255045")}>
              (42) 3025 5045
            </a>
          </div>
        </nav>

        <div className="md:tw-hidden tw-block tw-ml-[8px] tw-rounded-[12px] tw-border tw-border-slate-200 tw-bg-slate-50 tw-shadow-[0_10px_18px_-16px_rgba(15,23,42,0.5)]">
          <Hamburger toggled={isOpen} toggle={setOpen} label={isOpen ? "Fechar menu" : "Abrir menu"} aria-controls="primary-navigation" />
        </div>
      </div>
    </header>
  );
}
