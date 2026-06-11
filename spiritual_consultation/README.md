# BioPara Mobile App

Flutter application for BioPara patients and admins.

## Entry Points

- `lib/main.dart` - default patient app used by `flutter run`.
- `lib/main_patient.dart` - explicit patient build entry point.
- `lib/main_admin.dart` - admin build entry point.

## Main Features

- Patient authentication and profile management.
- Product shop, cart, orders, and order details.
- Admin dashboard, patients, appointments, reports, orders, and chat.
- Realtime chat, media upload, voice tools, and call screens.
- Supabase, Firebase Messaging, Stripe, and AI integrations.
- Arabic/French translations and RTL-first UI.

## Setup

```bash
flutter pub get
```

Copy `.env.example` to `.env` and fill in the real project values.

## Run

```bash
flutter run
flutter run -t lib/main_patient.dart
flutter run -t lib/main_admin.dart
```

## Test

```bash
flutter test
```

## Database

SQL setup and migration files live in `supabase/`. Keep these scripts aligned with the web ecommerce schema when touching products, orders, profiles, chat, or admin roles.

## Releases

Generated APK files are stored under `releases/`. Treat them as build artifacts and rebuild them after dependency, Firebase, Supabase, or native Android changes.
