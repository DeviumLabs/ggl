import Link from "next/link";
import { useRouter } from "next/router";
import { dlPush } from "../lib/analytics/dataLayer";

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

  const qCategoria = typeof router.query?.categoria === "string" ? router.query.categoria : "";
  const qProduto = typeof router.query?.produto === "string" ? router.query.produto : "";

  const fallback = getPathParts(router.asPath);
  const activeCategory = qCategoria || fallback.categoria;
  const activeProduct = qProduto || fallback.produto;

  const handleProductClick = (category, product) => {
    dlPush("select_item", {
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

  const list = categories || [];

  return (
    <nav className="tw-absolute tw-left-0 tw-z-[300] tw-w-[15%] tw-min-w-[200px] tw-bg-blue tw-px-[10px] tw-py-[30px]">
      <h2 className="tw-text-white">
        LINHA DE PRODUTOS
        <hr className="tw-h-[1px] tw-w-[80%] tw-bg-white tw-border-white tw-mt-[5px]" />
      </h2>

      <div className="tw-mb-[20px] tw-flex tw-flex-col">
        {list.map((category) => {
          const isActiveCategory = category.slug === activeCategory;

          return (
            <div
              key={category.slug}
              className={[
                "tw-mt-[20px] tw-rounded-[8px] tw-py-[6px]",
                isActiveCategory ? "tw-bg-white/10 tw-border-l-4 tw-border-white tw-pl-[8px]" : ""
              ].join(" ")}
            >
              <h3
                className={[
                  "tw-text-white",
                  isActiveCategory ? "tw-font-semibold" : "tw-font-light"
                ].join(" ")}
              >
                {category.name}
              </h3>

              <div className="tw-flex tw-flex-col tw-mt-[6px]">
                {(category.products || []).map((product) => {
                  const isActiveProduct =
                    isActiveCategory && product.slug === activeProduct;

                  return (
                    <Link
                      key={product.slug}
                      href={`/produtos/${category.slug}/${product.slug}`}
                      onClick={() => handleProductClick(category, product)}
                      aria-current={isActiveProduct ? "page" : undefined}
                      className={[
                        "tw-pl-[10px] tw-text-[14px] tw-font-light tw-rounded-[8px] tw-py-[6px] tw-pr-[8px] tw-transition",
                        "hover:tw-bg-white/10 hover:tw-underline",
                        isActiveProduct
                          ? "tw-bg-white tw-text-blue tw-font-semibold hover:tw-no-underline"
                          : "tw-text-white"
                      ].join(" ")}
                    >
                      ● {product.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
