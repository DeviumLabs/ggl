import Link from "next/link";
import Image from "next/image";
import SeoHead from "../../../components/layout/SeoHead";
import ContactForm from "../../../components/contact/ContactForm";
import { categories, getAllCategorySlugs, getCategoryBySlug, getCatalogByCategorySlug } from "../../../lib/catalog";
import { dlPush } from "../../../lib/analytics/dataLayer";
import { itemListJsonLd } from "../../../lib/seo/buildJsonLd";
import { useEffect } from "react";

export async function getStaticPaths() {
  const slugs = getAllCategorySlugs();
  return {
    paths: slugs.map((categoria) => ({ params: { categoria } })),
    fallback: "blocking"
  };
}

export async function getStaticProps({ params }) {
  const categoria = params?.categoria || "";
  const category = getCategoryBySlug(categoria);
  const catalog = getCatalogByCategorySlug(categoria);

  if (!category || !catalog) return { notFound: true };

  const products = (catalog.products || []).map((p) => {
    const firstImage = Array.isArray(p.images) && p.images.length ? p.images[0] : "/assets/placeholder.png";
    return { ...p, firstImage };
  });

  return {
    props: { category, products, categories },
    revalidate: 300
  };
}

export default function CategoryPage({ category, products, categories }) {
  useEffect(() => {
    dlPush("view_item_list", {
      location: "category_page",
      item_list_name: `Categoria - ${category.name}`,
      items: (products || []).map((p, idx) => ({
        item_id: p.slug,
        item_name: p.name,
        item_category: category.name,
        item_category2: category.slug,
        index: idx + 1
      }))
    });
  }, [category, products]);

  const jsonLd = itemListJsonLd({
    name: `Produtos da categoria ${category.name}`,
    items: (products || []).map((p) => ({
      name: p.name,
      url: `https://www.gglmoveis.com.br/produtos/${category.slug}/${p.slug}`
    }))
  });

  const onProductClick = (p, idx) =>
    dlPush("select_item", {
      location: "category_page",
      item_list_name: `Categoria - ${category.name}`,
      items: [
        {
          item_id: p.slug,
          item_name: p.name,
          item_category: category.name,
          item_category2: category.slug,
          index: idx + 1
        }
      ]
    });

  return (
    <div>
      <SeoHead
        title={`GGL Móveis de Aço | ${category.name}`}
        description={category.description}
        canonical={`https://www.gglmoveis.com.br/produtos/${category.slug}`}
        jsonLd={jsonLd}
      />

      <main className="tw-mt-[120px] tw-mb-[100px] tw-relative">
        <section className="tw-px-[20px] tw-max-w-[1280px] tw-mx-auto tw-pt-[30px]">
          <h1 className="tw-text-[34px] tw-text-center">{category.name}</h1>
          <p className="tw-text-center tw-max-w-[900px] tw-mx-auto tw-mt-[10px]">{category.description}</p>
        </section>

        <section className="tw-px-[20px] tw-max-w-[1280px] tw-w-full tw-mx-auto tw-mt-[60px] tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-[30px]">
          {(products || []).map((p, idx) => (
            <Link
              key={p.slug}
              href={`/produtos/${category.slug}/${p.slug}`}
              className="tw-border tw-border-gray-200 tw-rounded-lg tw-p-[16px] hover:tw-shadow-md tw-transition"
              onClick={() => onProductClick(p, idx)}
            >
              <div className="tw-w-full tw-aspect-[4/3] tw-relative tw-overflow-hidden tw-rounded-md">
                <Image src={p.firstImage} alt={`${p.name} - ${category.singleName}`} fill sizes="(max-width: 768px) 90vw, 400px" style={{ objectFit: "contain" }} />
              </div>
              <h2 className="tw-text-[18px] tw-mt-[12px]">{p.name}</h2>
              <p className="tw-text-[14px] tw-opacity-80 tw-mt-[6px]">{p.description}</p>
            </Link>
          ))}
        </section>

        <ContactForm />
      </main>
    </div>
  );
}
