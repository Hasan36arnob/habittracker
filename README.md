# Habit Tracker App (React Native)

Premium habit tracker mobile app UI built with React Native, ready for Android APK builds in GitHub Actions.

## Local development

```sh
npm install
npm start
npm run android
```

## GitHub Actions APK build

Workflow file: `.github/workflows/android-apk.yml`

It builds:
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK:
  - `android/app/build/outputs/apk/release/app-release.apk` (if signing secrets provided)
  - `android/app/build/outputs/apk/release/app-release-unsigned.apk` (fallback)

Run it from GitHub:
1. Push project to GitHub.
2. Open `Actions` tab.
3. Run `Build Android APK`.

## Release signing for store uploads (required to sell)

Add these repository secrets in GitHub:
- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_STORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

How to create the base64 secret:
```sh
base64 -w 0 your-release-key.keystore
```
Use the output as `ANDROID_KEYSTORE_BASE64`.

## Uptodown publishing checklist

1. Build signed release APK from GitHub Actions.
2. Test on at least one physical Android device.
3. Increment `versionCode` and `versionName` in `android/app/build.gradle`.
4. Upload signed APK to Uptodown.
