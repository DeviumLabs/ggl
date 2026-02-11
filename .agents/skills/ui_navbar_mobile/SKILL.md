# Skill: Mobile navbar behavior (toggle + no overlap)

## Use when

- Navbar overlaps content or needs mobile-specific behavior.

## UX goals

- Mobile: navbar should be collapsed by default and opened via a clear toggle.
- Close on:
  - clicking outside
  - selecting a product
  - tapping the active product again
- Desktop: keep always-visible sidebar behavior.

## A11y requirements

- Toggle is a button with aria-expanded and aria-controls.
- Focus should not get trapped; Esc closes if implemented.

## Output

- Minimal patch touching Navbar + necessary layout/container styles only.
