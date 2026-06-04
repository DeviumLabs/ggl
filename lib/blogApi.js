const API_URL = process.env.PAYLOAD_API_URL;
const SITE_SLUG = process.env.SITE_SLUG;
const isDev = process.env.NODE_ENV === "development";

function normalizeBlocks(docs) {
  return docs.map((post) => ({
    ...post,
    coverImage: {
      url: post.coverImage?.url ?? "",
      alt: post.coverImage?.alt ?? "",
      width: post.coverImage?.width ?? 1200,
      height: post.coverImage?.height ?? 630,
    },
    body: (post.body ?? []).map((block) => ({
      ...block,
      _type: block.blockType ?? block._type,
    })),
  }));
}

export async function getPosts(page = 1, categorySlug) {
  let url =
    `${API_URL}/api/posts` +
    `?where[site.slug][equals]=${SITE_SLUG}` +
    `&where[status][equals]=published` +
    `&page=${page}` +
    `&limit=10` +
    `&depth=1`;

  if (categorySlug) url += `&where[categories.slug][equals]=${categorySlug}`;

  const res = await fetch(url, isDev ? { next: { revalidate: 60 } } : { cache: "no-store" });
  if (!res.ok) {
    return { docs: [], totalDocs: 0, page: 1, totalPages: 0, hasNextPage: false, hasPrevPage: false };
  }

  const data = await res.json();
  return { ...data, docs: normalizeBlocks(data.docs) };
}

export async function getPost(slug) {
  const url =
    `${API_URL}/api/posts` +
    `?where[slug][equals]=${slug}` +
    `&where[site.slug][equals]=${SITE_SLUG}` +
    `&where[status][equals]=published` +
    `&depth=2`;

  const res = await fetch(url, isDev ? { next: { revalidate: 60 } } : { cache: "no-store" });
  if (!res.ok) return null;

  const data = await res.json();
  const posts = normalizeBlocks(data.docs);
  return posts[0] ?? null;
}
