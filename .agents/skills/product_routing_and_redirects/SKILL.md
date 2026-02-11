# Skill: Product routing + legacy redirects

## Use when

- Touching /produtos routing, redirects, middleware, or getServerSideProps params.

## Guardrails

- Do not introduce a second canonical URL for the same product.
- Avoid redirect loops.
- Keep permanent redirect (301) for legacy routes.

## Steps

1. Map current canonical route and any legacy patterns.
2. Ensure next.config.js redirects cover legacy query-style URLs.
3. Ensure middleware does not conflict (double redirect).
4. Verify dynamic param names match the filesystem route.
5. Smoke test:
   - Open a legacy URL and confirm single 301 to canonical.
   - Navigate between products without hydration issues.
