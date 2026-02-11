# Codex playbook — GGL

## Default language
- Talk to Codex in English.
- Keep site UI copy in pt-BR.

## High-signal prompts (copy/paste)
- "Audit the product page SEO (Head, canonical, JSON-LD) and propose minimal changes."
- "Fix mobile overlap issues on Navbar without changing desktop layout."
- "Ensure legacy /produtos/:categoria?product=:produto redirects to /produtos/:categoria/:produto (301) and no loops."
- "Check for duplicate Header/Footer rendering and fix with the least invasive approach."
- "Review /pages/api/mail.js for validation, rate limit, and safe HTML escaping."

## Definition of done
- npm run build succeeds
- no routing errors on navigation
- product pages render with canonical + JSON-LD
- mobile layout: navbar does not cover content
- contact form still sends email and fires analytics events
