# Waha Firebase Configuration
This folder contains 3 critical files for using Firebase with Waha:
1. `db.js`: This file contains the main configuration object for Firebase. It also creates and exports the Firestore database object so that any other file in the app can access it.
2. `prodConfig.js`: Contains the configuration/API key for the production database.
3. `testConfig.js`: Contains the configuration/API key for the test database.
4. `google-services.json`: A config file that allows Firebase to be used with Expo on Android devices. Referenced in app.json under the `expo.android.googleServicesFile` key.
5. `GoogleService-Info.plist`: Another config file that allows Firebase to be used with Expo on iOS devices. Referenced in app.json under the `expo.ios.googleServicesFile` key.

For obvious reasons, all except `db.js` are git-ignored.