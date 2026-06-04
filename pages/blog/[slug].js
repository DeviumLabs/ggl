import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { getPost, getPosts } from "../../lib/blogApi";
import { isBlogEnabled } from "../../lib/flags";
import { BlockRenderer } from "../../components/blog/BlockRenderer";

export async function getStaticPaths() {
  if (!isBlogEnabled()) return { paths: [], fallback: false };

  const data = await getPosts();
  const paths = data.docs.map((post) => ({ params: { slug: post.slug } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  if (!isBlogEnabled()) return { notFound: true };

  const post = await getPost(params.slug);
  if (!post) return { notFound: true };

  return { props: { post }, revalidate: 60 };
}

export default function BlogPostPage({ post }) {
  const router = useRouter();
  if (router.isFallback) return <div>Carregando...</div>;

  const categoryLine = (post.categories ?? []).map((c) => c.name).join(", ");

  return (
    <>
      <Head>
        <title>{post.seo?.title ?? post.title}</title>
        {post.seo?.description && <meta name="description" content={post.seo.description} />}
        {post.seo?.ogImage && <meta property="og:image" content={post.seo.ogImage} />}
      </Head>
      <main
        style={{
          maxWidth: "var(--blog-content-width)",
          margin: "0 auto",
          padding: "var(--blog-space-8) var(--blog-space-4)",
        }}
      >
        <header style={{ marginBottom: "var(--blog-space-8)" }}>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--blog-color-text-muted)",
              marginBottom: "var(--blog-space-4)",
            }}
          >
            {categoryLine}
            {post.publishedAt && <> · {new Date(post.publishedAt).toLocaleDateString("pt-BR")}</>}
          </p>
          <h1
            style={{
              fontSize: "var(--text-4xl)",
              fontWeight: "700",
              lineHeight: "var(--blog-line-height-tight)",
              color: "var(--blog-color-text)",
            }}
          >
            {post.title}
          </h1>
          {post.seo?.description && (
            <p
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--blog-color-text-muted)",
                marginTop: "var(--blog-space-4)",
              }}
            >
              {post.seo.description}
            </p>
          )}
          {post.coverImage?.url && (
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              width={post.coverImage.width}
              height={post.coverImage.height}
              priority
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "var(--blog-radius-sm)",
                marginTop: "var(--blog-space-6)",
              }}
            />
          )}
        </header>
        <BlockRenderer blocks={post.body} />
      </main>
    </>
  );
}
