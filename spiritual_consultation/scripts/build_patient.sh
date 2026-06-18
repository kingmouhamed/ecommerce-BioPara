#!/usr/bin/env bash
# Builds the release Patient APK with all secrets injected via --dart-define.
# Reads values from a local .env file (never committed, never bundled).
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "Missing .env file. Copy .env.example to .env and fill in real values first."
  exit 1
fi
set -a
source .env
set +a

flutter build apk --release \
  --split-per-abi \
  --flavor patient \
  -t lib/main_patient.dart \
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

echo "Built (per-ABI APKs) in: build/app/outputs/flutter-apk/"
echo "  app-patient-armeabi-v7a-release.apk"
echo "  app-patient-arm64-v8a-release.apk"
echo "  app-patient-x86_64-release.apk"
