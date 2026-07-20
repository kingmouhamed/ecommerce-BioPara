# BioPara Platform

BioPara is split into two products that share the same business domain:

- `clerk-nextjs/` - the ecommerce web store built with Next.js, React, Tailwind CSS, Clerk, Supabase, Stripe, and email providers.
- `spiritual_consultation/` - the Flutter mobile app with patient/admin entry points, shop, orders, chat, calls, Supabase, Firebase, Stripe, and AI support.

## Project Structure

```text
.
├── clerk-nextjs/                 # Web ecommerce app
│   ├── app/                      # Next.js App Router pages and API routes
│   ├── components/               # UI, layout, cart, checkout, admin components
│   ├── lib/                      # Supabase, services, security, SEO, utilities
│   ├── public/                   # Product images, banners, icons, static assets
│   ├── database/                 # SQL schemas
│   └── package.json
├── spiritual_consultation/       # Flutter mobile apps
│   ├── lib/main.dart             # Default patient app entry point
│   ├── lib/main_patient.dart     # Patient app entry point
│   ├── lib/main_admin.dart       # Admin app entry point
│   ├── lib/core/                 # Models, providers, services, theme
│   ├── lib/patient/              # Patient screens and widgets
│   ├── lib/admin/                # Admin screens
│   ├── supabase/                 # Flutter app database scripts
│   └── releases/                 # Generated APK release artifacts
├── package.json                  # Root convenience scripts
└── README.md
```

## Requirements

- Node.js 20 or newer for the web app dependencies.
- npm for JavaScript package management.
- Flutter SDK 3.11.4 or compatible for the mobile app.
- Supabase project credentials.
- Clerk, Stripe, SendGrid/Resend, Cloudinary, Firebase, and Redis credentials as needed by enabled features.

## Web App

Install and run from the repository root:

```bash
npm run web:install
npm run web:dev
```

Useful commands:

```bash
npm run web:build
npm run web:start
npm run web:test
npm run web:lint
```

The local web app runs at `http://localhost:3000` by default.

Create `clerk-nextjs/.env.local` from `clerk-nextjs/.env.local.example` and fill in real values. Keep real secret files out of commits.

## Mobile App

Install Flutter packages:

```bash
npm run mobile:get
```

Run the default patient app:

```bash
npm run mobile:run
```

Run a specific entry point:

```bash
cd spiritual_consultation
flutter run -t lib/main_patient.dart
flutter run -t lib/main_admin.dart
```

Run tests:

```bash
npm run mobile:test
```

Create `spiritual_consultation/.env` from `spiritual_consultation/.env.example` and fill in the required values.

## Database

Web SQL scripts live in:

- `clerk-nextjs/database/`
- `clerk-nextjs/app/supabase/migrations/`

Mobile SQL scripts live in:

- `spiritual_consultation/supabase/`
- `spiritual_consultation/supabase/migrations/`

Apply schema changes carefully and keep web/mobile assumptions aligned when products, orders, profiles, or chat tables change.

## Security Notes

- Do not commit `.env`, `.env.local`, API keys, service-role keys, webhook secrets, or private Firebase files.
- `clerk-nextjs/.env.local` was removed from git tracking and should remain local only. Rotate any exposed keys if this repository has been shared or pushed before this cleanup.
- Firebase files such as `google-services.json` and `GoogleService-Info.plist` can contain project configuration. Confirm whether they are safe for your deployment policy before publishing the repository.

## Operational Checklist

Before deployment:

- Run `npm run web:test` and `npm run web:build`.
- Run `npm run mobile:test`.
- Confirm environment variables are set in Vercel/hosting and mobile build environments.
- Confirm Supabase migrations and seed scripts are applied to the correct project.
- Confirm Stripe webhook secrets match the deployed webhook endpoint.
- Confirm Firebase configuration matches the Android/iOS app IDs.
