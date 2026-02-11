# Product pages override — /pages/produtos/*

## Canonical routing
- Canonical: /produtos/[categoria]/[produto]
- Legacy patterns must redirect with 301 to canonical without query leftovers.

## Analytics
- view_item on product page load (only client-side)
- select_item on thumbnail click and navbar click
- request_quote_click must keep existing event shape

## UX
- Product page content must not be obscured by navbar on mobile.
- Keep interaction smooth; avoid layout jumps when images/models change.
