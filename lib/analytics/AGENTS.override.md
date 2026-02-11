# Analytics override — /lib/analytics

## Contract
- dlPush must be a no-op in SSR environments.
- Keep event names stable and payload keys consistent.
- Do not send raw PII in events; normalize if needed and only when explicitly required.
