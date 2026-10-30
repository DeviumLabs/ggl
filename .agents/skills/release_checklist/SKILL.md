# Skill: Release checklist (pre-deploy)

## Steps

1. pnpm run lint
2. pnpm run build
3. Quick manual checks:
   - Home loads, Header and Footer present once
   - /produtos pages load and internal nav works
   - Product page has title/description/canonical/JSON-LD
   - Mobile: navbar does not cover content
   - Contact: email send works and success toast shows
   - WhatsApp button visible and functional

## Output

- List of what passed/failed and where to look if something failed.
