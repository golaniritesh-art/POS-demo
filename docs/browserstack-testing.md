# BrowserStack Appium Testing

The NUnit Appium regression tests can run either against a local Appium server or BrowserStack App Automate.

## Local Android

Build the app and run against a local emulator/Appium server:

```powershell
npm run android:build
npm run test:appium
```

Optional local variables:

```powershell
$env:POS_APK = "C:\path\to\app-debug.apk"
$env:APPIUM_SERVER_URL = "http://127.0.0.1:4723"
$env:APPIUM_DEVICE_NAME = "emulator-5554"
```

## BrowserStack Android

Build the APK, upload it to BrowserStack App Automate, and run the Appium regression tests:

```powershell
$env:BROWSERSTACK_USERNAME = "your_username"
$env:BROWSERSTACK_ACCESS_KEY = "your_access_key"

npm run test:browserstack
```

The script uploads `platforms\android\app\build\outputs\apk\debug\app-debug.apk` and passes the returned `bs://...` app URL into the test process as `BROWSERSTACK_APP`.

To upload an already-built APK without rebuilding:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\run-browserstack-appium.ps1 -SkipBuild
```

To use a specific APK path:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\run-browserstack-appium.ps1 -ApkPath "C:\path\to\app-debug.apk"
```

If the APK is already uploaded, set the app id yourself and run the direct BrowserStack test command. BrowserStack accepts `bs://...` app URLs, configured custom IDs, and shareable IDs for the app capability.

```powershell
$env:BROWSERSTACK_ENABLED = "true"
$env:BROWSERSTACK_USERNAME = "your_username"
$env:BROWSERSTACK_ACCESS_KEY = "your_access_key"
$env:BROWSERSTACK_APP = "bs://your_uploaded_app_id"

npm run test:browserstack:uploaded
```

Optional BrowserStack variables:

```powershell
$env:BROWSERSTACK_DEVICE_NAME = "Samsung Galaxy S25"
$env:BROWSERSTACK_OS_VERSION = "15.0"
$env:BROWSERSTACK_PROJECT_NAME = "Retail POS"
$env:BROWSERSTACK_BUILD_NAME = "build-123"
$env:BROWSERSTACK_CUSTOM_ID = "retail-pos-latest"
```

The BrowserStack mode sends `bstack:options` with text, Appium, device, visual, and network logs enabled so failures have enough diagnostics in the BrowserStack dashboard.
