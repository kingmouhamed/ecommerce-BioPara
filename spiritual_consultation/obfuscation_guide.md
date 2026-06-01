# BioPara - Flutter Obfuscation & Security Guide

To protect your application source code, API keys, and sensitive class names from reverse-engineering (decompilation of APK or IPA files), you should always build production releases with **obfuscation** enabled.

## Android Production Build Command

Run the following command to compile a secure, obfuscated release APK:

```bash
flutter build apk --release --obfuscate --split-debug-info=build/app/outputs/symbols
```

### Explanation of flags:
* `--obfuscate`: Obfuscates class names, function names, and file path mappings inside the Dart code.
* `--split-debug-info`: Strips out debugger symbol mappings and saves them separately in the specified folder. This significantly reduces the size of your final APK and prevents hackers from viewing your original function names.

## iOS Production Build Command

To build an obfuscated iOS archive:

```bash
flutter build ipa --obfuscate --split-debug-info=build/ios/outputs/symbols
```

## Security Best Practices
1. **Never commit `.env` files to git**: Always keep the production `.env` ignored.
2. **Secure Key Storage**: Use the provided `SecureStorageService` (which uses system KeyStore/Keychain) for passwords, auth tokens, and session keys rather than standard `SharedPreferences`.
