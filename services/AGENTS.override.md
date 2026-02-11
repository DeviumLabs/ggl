# Services override — /services

## Axios baseURL
- Must work in both browser and SSR.
- Browser: baseURL "/api"
- SSR: prefer NEXT_PUBLIC_API_BASE_URL, then VERCEL_URL, then localhost fallback.

## Errors
- Preserve interceptor behavior: surface a readable Error(message).
- Do not swallow server error payloads unless necessary.
