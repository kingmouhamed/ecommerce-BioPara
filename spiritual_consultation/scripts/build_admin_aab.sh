#!/usr/bin/env bash
# Builds the release Admin Android App Bundle (.aab) for the Play Store.
# Play Store generates per-device APKs from the AAB, so users download only
# the ABI + resources their device needs (40-60% smaller than a fat APK).
# Secrets are injected via --dart-define and are never bundled as assets.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "Missing .env file. Copy .env.example to .env and fill in real values first."
  exit 1
fi
set -a
source .env
set +a

flutter build appbundle --release \
  --obfuscate --split-debug-info=build/admin/symbols \
  --flavor admin \
  -t lib/main_admin.dart \
  --dart-define=SUPABASE_URL="$SUPABASE_URL" \
  --dart-define=SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
  --dart-define=GEMINI_API_KEY="$GEMINI_API_KEY" \
  --dart-define=ZEGO_APP_ID="$ZEGO_APP_ID" \
  --dart-define=ZEGO_APP_SIGN="$ZEGO_APP_SIGN" \
  --dart-define=FIREBASE_API_KEY="$FIREBASE_API_KEY" \
  --dart-define=FIREBASE_PROJECT_ID="$FIREBASE_PROJECT_ID" \
  --dart-define=FIREBASE_MESSAGING_SENDER_ID="$FIREBASE_MESSAGING_SENDER_ID" \
  --dart-define=FIREBASE_APP_ID="$FIREBASE_APP_ID" \
  --dart-define=FIREBASE_MEASUREMENT_ID="$FIREBASE_MEASUREMENT_ID"

echo "Built: build/app/outputs/bundle/adminRelease/app-admin-release.aab"
