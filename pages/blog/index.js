import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "../../lib/blogApi";
import { isBlogEnabled } from "../../lib/flags";

export async function getStaticProps() {
  if (!isBlogEnabled()) return { notFound: true };

  const data = await getPosts();
  return { props: { posts: data.docs }, revalidate: 60 };
}

export default function BlogPage({ posts }) {
  return (
    <>
      <Head>
        <title>Blog | GGL Móveis</title>
        <meta
          name="description"
          content="Tendências, dicas e novidades sobre móveis corporativos e ambientes de aço."
        />
      </Head>
      <main
        style={{
          maxWidth: "var(--blog-wide-width)",
          margin: "0 auto",
          padding: "var(--blog-space-8) var(--blog-space-4)",
        }}
      >
        <h1
          style={{
            fontSize: "var(--text-4xl)",
            fontWeight: "700",
            marginBottom: "var(--blog-space-8)",
            color: "var(--blog-color-text)",
          }}
        >
          Blog
        </h1>
        {posts.length === 0 && (
          <p style={{ color: "var(--blog-color-text-muted)" }}>Nenhum post publicado ainda.</p>
        )}
        <div
          style={{
            display: "grid",
            gap: "var(--blog-space-8)",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article>
                {post.coverImage?.url && (
                  <Image
                    src={post.coverImage.url}
                    alt={post.coverImage.alt}
                    width={post.coverImage.width}
                    height={post.coverImage.height}
                    style={{
                      width: "100%",
                      height: "var(--blog-card-cover-height)",
                      objectFit: "cover",
                      borderRadius: "var(--blog-radius-sm)",
                    }}
                  />
                )}
                <h2
                  style={{
                    fontSize: "var(--text-xl)",
                    fontWeight: "600",
                    marginTop: "var(--blog-space-4)",
                    color: "var(--blog-color-text)",
                  }}
                >
                  {post.title}
                </h2>
                {post.seo?.description && (
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--blog-color-text-muted)",
                      marginTop: "var(--blog-space-4)",
                    }}
                  >
                    {post.seo.description}
                  </p>
                )}
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--blog-color-text-muted)",
                    marginTop: "var(--blog-space-4)",
                  }}
                >
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("pt-BR") : ""}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
