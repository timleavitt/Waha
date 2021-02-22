# Waha Firebase Configuration
This folder contains 3 critical files for using Firebase with Waha:
1. `db.js`: This file contains the main configuration object for Firebase. It also creates and exports the Firestore database object so that any other file in the app can access it.
2. `google-services.json`: A config file that allows Firebase to be used with Expo on Android devices. Referenced in app.json under the `expo.android.googleServicesFile` key.
3. `GoogleService-Info.plist`: Another config file that allows Firebase to be used with Expo on iOS devices. Referenced in app.json under the `expo.ios.googleServicesFile` key.

For obvious reasons, these 3 files are git-ignored.