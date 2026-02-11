# Pages override — Next.js Pages Router

## SEO
- Use next/head for title/description/canonical.
- Prefer stable, descriptive titles for product/category pages.
- Ensure 404 behavior is correct (return notFound: true when missing).

## Rendering
- Prefer getServerSideProps for pages that must be fresh or depend on query params.
- Do not access window/document outside guarded checks.

## Layout rule
- Do not add Header/Footer if the site layout already provides them.
- If a page is standalone by design, it must clearly own header/footer and must not be wrapped twice.
