export default function Navbar({ categories }) {
  console.log(categories);
  return (
    <nav className="tw-absolute tw-left-0 tw-z-[300] tw-w-[15%] tw-min-w-[200px] tw-bg-blue tw-px-[10px] tw-py-[30px]">
      <h1 className="tw-text-white ">
        LINHA DE PRODUTOS
        <hr className="tw-h-[1px] tw-w-[80%]  tw-mt-[5px]" />
      </h1>

      <div className="tw-mb-[20px] tw-flex tw-flex-col">
        {categories.categoryArray.map((_category, i) => (
          <div className="tw-mt-[20px]">
            <h3 className="tw-font-light tw-text-white">{_category.name}</h3>
            <div className="tw-flex tw-flex-col">
              {_category.products.map((product, i) => (
                <a
                  href={`/produtos/${_category.slug}?product=${product.slug}`}
                  className="tw-text-white tw-pl-[10px] tw-text-[14px] tw-font-light hover:tw-underline"
                >
                  ● {product.name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
