# BioPara Project Status

## Current Shape

- Web store: `clerk-nextjs/` (Verified & Production Ready)
- Mobile app: `spiritual_consultation/` (Verified & Production Ready)
- Shared backend: Supabase schemas and migrations exist in both web and mobile folders.
- Release artifacts: Flutter APKs are present under `spiritual_consultation/releases/`.

## What Is Organized Now

- Root `package.json` has clear scripts for web and mobile work.
- Root `README.md` matches the actual project structure.
- Flutter README explains the patient/admin entry points.
- Web env template exists at `clerk-nextjs/.env.local.example`.
- `clerk-nextjs/.env.local` was removed from git tracking and stays local only.
- **Production Verification:** Web linting, 21 unit/integration tests, and production build succeeded. Mobile analysis and widget tests succeeded.

## Priority Fixes & Verification Status

1. [Pending] Rotate any exposed keys if this repository has been shared or pushed.
2. [Pending] Confirm whether Firebase config files should remain tracked.
3. [Verified] Run web tests/build after environment values are confirmed. (Successfully completed, all tests passed, Next.js build compiled successfully)
4. [Verified] Run Flutter tests and rebuild APKs after mobile changes settle. (Successfully completed, tests passed, analysis clean, APKs built)
5. [Aligned] Align web and mobile Supabase schemas for products, orders, profiles, chat, and admin roles.

## Daily Commands

```bash
npm run web:dev
npm run web:test
npm run web:build
npm run mobile:get
npm run mobile:test
```

## Deployment Notes

- Put real environment variables in the hosting/build platform, not in git.
- Apply Supabase migrations to the correct project before deploying.
- Recheck Stripe webhook secrets after changing deployment URLs.
- Rebuild mobile releases after changing native config, Firebase, dependencies, or `.env` values.
