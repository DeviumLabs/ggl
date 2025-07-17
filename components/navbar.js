import Link from "next/link";

export default function Navbar({ categories }) {
  return (
    <nav
      className="tw-absolute tw-left-0 tw-z-[300] tw-w-[15%] tw-min-w-[200px] tw-bg-blue tw-px-[10px] tw-py-[30px]"
      aria-label="Menu de categorias de produtos"
    >
      <h2 className="tw-text-white">
        LINHA DE PRODUTOS
        <hr className="tw-h-[1px] tw-w-[80%] tw-mt-[5px]" />
      </h2>

      <div className="tw-mb-[20px]">
        <ul className="tw-flex tw-flex-col">
          {categories.categoryArray.map((_category) => (
            <li key={_category.slug} className="tw-mt-[20px]">
              <h3 className="tw-font-light tw-text-white">{_category.name}</h3>
              <ul className="tw-flex tw-flex-col tw-pl-[10px]">
                {_category.products.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`/produtos/${_category.slug}?product=${product.slug}`}
                      passHref
                    >
                      <a className="tw-text-white tw-text-[14px] tw-font-light hover:tw-underline">
                        ● {product.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
