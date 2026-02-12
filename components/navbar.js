import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { trackSelectItem } from "../lib/analytics/events";

function getPathParts(asPath = "") {
  const clean = (asPath || "").split("?")[0].split("#")[0];
  const parts = clean.split("/").filter(Boolean);
  const idx = parts.indexOf("produtos");
  if (idx === -1) return { categoria: "", produto: "" };
  return {
    categoria: parts[idx + 1] || "",
    produto: parts[idx + 2] || ""
  };
}

export default function Navbar({ categories }) {
  const router = useRouter();
  const uid = useId();
  const mobilePanelRef = useRef(null);
  const previousFocusRef = useRef(null);

  const qCategoria = typeof router.query?.categoria === "string" ? router.query.categoria : "";
  const qProduto = typeof router.query?.produto === "string" ? router.query.produto : "";

  const fallback = getPathParts(router.asPath);
  const activeCategory = qCategoria || fallback.categoria;
  const activeProduct = qProduto || fallback.produto;

  const list = useMemo(() => categories || [], [categories]);

  const [openCategory, setOpenCategory] = useState(activeCategory || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (activeCategory) setOpenCategory(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    if (!router?.events) return;
    const close = () => setMobileOpen(false);
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router?.events]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    previousFocusRef.current = typeof document !== "undefined" ? document.activeElement : null;
    const focusTimer = setTimeout(() => {
      const firstFocusable = mobilePanelRef.current?.querySelector("button, a[href]");
      if (firstFocusable) firstFocusable.focus();
    }, 0);

    return () => {
      clearTimeout(focusTimer);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [mobileOpen]);

  const handleProductClick = (category, product) => {
    trackSelectItem({
      location: "navbar",
      item_list_name: "Navbar categorias",
      items: [
        {
          item_id: product.slug,
          item_name: product.name,
          item_category: category.name,
          item_category2: category.slug
        }
      ]
    });
  };

  const onProductLinkClick = (e, category, product, isActiveProduct) => {
    handleProductClick(category, product);
    if (isActiveProduct) e.preventDefault();
    setMobileOpen(false);
  };

  const NavContent = ({ isMobile }) => (
    <>
      <div className="tw-flex tw-items-center tw-justify-between tw-gap-[10px]">
        <div className="tw-flex tw-flex-col tw-gap-[6px]">
          <h2 className="tw-text-white tw-font-semibold tw-text-[15px] tw-tracking-[0.02em]">LINHA DE PRODUTOS</h2>
          <span className="tw-h-[1px] tw-w-[80%] tw-bg-white/70" aria-hidden="true" />
        </div>

        {isMobile ? (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="tw-text-white tw-w-[36px] tw-h-[36px] tw-rounded-[10px] tw-bg-white/10 tw-flex tw-items-center tw-justify-center focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-white/80"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        ) : null}
      </div>

      <div className="tw-mb-[10px] tw-flex tw-flex-col">
        {list.map((category) => {
          const isActiveCategory = category.slug === activeCategory;
          const isOpen = openCategory === category.slug;
          const groupId = `${uid}-${category.slug}${isMobile ? "-m" : "-d"}`;

          return (
            <div
              key={category.slug}
              className={[
                "tw-mt-[14px] tw-rounded-[10px] tw-py-[6px]",
                isActiveCategory ? "tw-bg-white/10 tw-border-l-4 tw-border-white tw-pl-[8px]" : "tw-pl-[12px]"
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => setOpenCategory((prev) => (prev === category.slug ? "" : category.slug))}
                aria-expanded={isOpen}
                aria-controls={groupId}
                className="tw-w-full tw-flex tw-items-center tw-justify-between tw-gap-[10px] tw-text-left tw-text-white tw-py-[4px] focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-white/80 tw-rounded-[8px]"
              >
                <span className={isActiveCategory ? "tw-font-semibold" : "tw-font-light"}>{category.name}</span>
                <span
                  className={[
                    "tw-inline-flex tw-items-center tw-justify-center tw-w-[26px] tw-h-[26px] tw-rounded-[8px] tw-bg-white/10 tw-transition tw-duration-300",
                    isOpen ? "tw-rotate-180" : "tw-rotate-0"
                  ].join(" ")}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>

              <div
                id={groupId}
                aria-hidden={!isOpen}
                className={[
                  "tw-overflow-hidden tw-transition-all tw-duration-300 tw-ease-in-out",
                  isOpen ? "tw-max-h-[900px] tw-opacity-100 tw-mt-[6px] tw-pointer-events-auto" : "tw-max-h-0 tw-opacity-0 tw-mt-0 tw-pointer-events-none"
                ].join(" ")}
              >
                <div className="tw-flex tw-flex-col">
                  {(category.products || []).map((product) => {
                    const isActiveProduct = isActiveCategory && product.slug === activeProduct;

                    return (
                      <Link
                        key={product.slug}
                        href={`/produtos/${category.slug}/${product.slug}`}
                        onClick={(e) => onProductLinkClick(e, category, product, isActiveProduct)}
                        aria-current={isActiveProduct ? "page" : undefined}
                        tabIndex={isOpen ? 0 : -1}
                        className={[
                          "tw-pl-[10px] tw-text-[14px] tw-rounded-[10px] tw-py-[7px] tw-pr-[8px] tw-transition",
                          "hover:tw-bg-white/10 hover:tw-underline focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-white/80",
                          isActiveProduct
                            ? "tw-bg-white tw-text-blue tw-font-semibold hover:tw-no-underline"
                            : "tw-text-white tw-font-light"
                        ].join(" ")}
                      >
                        ● {product.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      <div className="md:tw-hidden tw-w-full tw-mb-[14px]">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
          aria-controls={`${uid}-mobile-products`}
          aria-label="Abrir linha de produtos"
          className="tw-w-full tw-bg-blue tw-text-white tw-px-[12px] tw-py-[14px] tw-rounded-[16px] tw-shadow-[0_14px_28px_-20px_rgba(15,23,42,0.65)] tw-flex tw-items-center tw-justify-between focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-blue focus-visible:tw-ring-offset-2"
        >
          <span className="tw-font-semibold">LINHA DE PRODUTOS</span>
          <span className="tw-inline-flex tw-items-center tw-justify-center tw-w-[36px] tw-h-[36px] tw-rounded-[10px] tw-bg-white/10">
            ☰
          </span>
        </button>
      </div>

      <div
        className={[
          "md:tw-hidden tw-fixed tw-inset-0 tw-z-[700] tw-transition",
          mobileOpen ? "tw-pointer-events-auto" : "tw-pointer-events-none"
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        <div
          className={[
            "tw-absolute tw-inset-0 tw-bg-black/50 tw-transition-opacity",
            mobileOpen ? "tw-opacity-100" : "tw-opacity-0"
          ].join(" ")}
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={[
            "tw-absolute tw-left-0 tw-top-0 tw-h-full tw-w-[86%] tw-max-w-[340px] tw-bg-blue tw-rounded-r-[24px] tw-border-r tw-border-blue/60 tw-px-[12px] tw-py-[18px] tw-overflow-y-auto tw-shadow-[0_26px_44px_-24px_rgba(15,23,42,0.7)] tw-transition-transform tw-duration-300",
            mobileOpen ? "tw-translate-x-0" : "-tw-translate-x-full"
          ].join(" ")}
          id={`${uid}-mobile-products`}
          ref={mobilePanelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Linha de produtos"
          onClick={(e) => e.stopPropagation()}
        >
          <NavContent isMobile />
        </div>
      </div>

      <nav
        className="tw-hidden md:tw-block tw-absolute tw-left-0 tw-z-[300] tw-w-[15%] tw-min-w-[200px] tw-bg-blue tw-rounded-r-[24px] tw-border-r tw-border-blue/60 tw-px-[10px] tw-py-[30px] tw-shadow-[0_26px_44px_-24px_rgba(15,23,42,0.65)]"
        aria-label="Linha de produtos"
      >
        <NavContent isMobile={false} />
      </nav>
    </>
  );
}
