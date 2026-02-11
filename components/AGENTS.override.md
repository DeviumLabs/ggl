# Components override

## UI consistency
- Tailwind prefix is tw- (do not use unprefixed classes).
- Prefer accessible semantics (buttons for actions, links for navigation).
- Use aria-current for active nav items and aria-expanded for toggles.

## SSR safety
- Avoid window/document unless guarded.
- For client-only widgets, use dynamic import with ssr: false.

## Events
- Use dlPush helper for analytics events (do not push raw dataLayer unless required by existing patterns).
