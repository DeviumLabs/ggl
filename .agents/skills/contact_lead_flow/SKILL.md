# Skill: Contact lead flow (Email + WhatsApp)

## Use when

- Updating contact UX, conversion tracking, or the email API.

## UX goals

- Reduce friction: user fills once, then chooses channel (WhatsApp or Email).
- Confirm expectations: show a clear confirmation message and response time.

## Technical goals

- Keep /api/mail stable and secure.
- Keep dataLayer events stable; add new events only if requested.

## Steps

1. Identify current form fields and validation rules.
2. Build message composer (pt-BR) reusable for WhatsApp + email.
3. Ensure WhatsApp CTA is enabled only when form is valid.
4. Keep spam trap and rate limiting.
5. Verify tracking events:
   - start_form
   - form_progress
   - form_submit (+ channel when available)
   - form_submit_success
