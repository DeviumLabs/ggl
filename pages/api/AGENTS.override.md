# API routes override — /pages/api/*

## Safety
- Validate required fields and return consistent JSON errors.
- Never log PII (name/email/phone/message).
- Keep HTML escaping for any user-provided content in emails.

## Compatibility
- Keep response shapes stable for the frontend (success/error).
- Prefer env-based configuration (MAIL_TO, MAIL_FROM, RESEND_API_KEY, ALLOWED_ORIGINS).

## Rate limit
- Keep lightweight IP-based limits in-memory and avoid heavy dependencies.
