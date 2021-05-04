# Waha Database Schema
Waha uses the Firestore database included in Firebase for data storage.
 
## languages
Contains objects for languages. The key is the ID of the language.
- `appVersion` **string** - The version of the app that this database version should line up with. If this version is ahead of the app version, the updates will not be written into local app data storage.
- `contactEmail` **string** - The contact email for this language. All feedback submissions are sent to this email.
- `canShareText` **boolean** - Whether this language has copyright permission to share Scripture text.
- `canShareAudio` **boolean** - Whether this language has copyright permission to share Scripture audio.
- `displayName` **string** - The name of the langauge in its own script.
- `bibleID` **string** - The API.Bible ID for the Bible translation that this language uses. Used to automatically fetch translations from API.Bible.
- `isRTL` **boolean** - Whether this language's script is right-to-left or not. Affects the navigation and layout of the whole app.
- `primaryColor` **string** - The primary color for the language in HEX form #FFFFFFF. 
- `files`  **string[]** - An array of file names that the app should download from Firebase upon installing this language instance.
- `questions` **Object** - Contains several arrays of questions whose keys should line up with a names from the `files` array.
- `questions[]` **string[]** - An array of individual questions. 
- `translations` **Object** - An object of all of Waha's app translations. They are separated by screen and also by whether they are a popup (alert/modal) or not.

## sets
Contains objects for sets. The key is the ID of the set.
- `sets[]` **Object** - An object containing the information for a set.
- `sets[].languageID` **string** - The ID for the language that this set is a part of.
- `sets[].title` **string** - The title of this set.
- `sets[].subtitle` **string** - The subtitle for this set.
- `sets[].iconName` **string** - The name of the SVG icon used for this set.
- `sets[].lessons` **Object[]** - An array of objects storing the lessons that are a part of this set.
- `sets[].lessons[].id` **string** - The ID of a lesson.
- `sets[].lessons[].title` **string** - The title of a lesson.
- `sets[].lessons[].hasAudio` **boolean** - Whether a lesson has an audio file for it stored in Firebase storage.
- `sets[].lessons[].hasVideo` **boolean** - Whether a lesson has a video file for it stored in Firebase storage.
- `sets[].lessons[].fellowshipType` **string** - (Optional) The question set used for the Fellowship chapter of this lesson. Should line up with a key in the `questions` object in the `languages` collection.
- `sets[].lessons[].applicationType` **string** - (Optional) The question set used for the Application chapter of this lesson. Should line up with a key in the `questions` object in the `languages` collection.
- `sets[].lessons[].text` **string** - (Optional) If a lesson is for a book or audiobook chapter, this is the text for the chapter.
- `sets[].lessons[].scripture` **Object[]** - (Optional) An array of objects storing the Scripture passage(s) for a lesson.
- `sets[].lessons[].scripture[].header` **string** - The header for the Scripture passage. This is the reference of the passage as it will be displayed in the app.
- `sets[].lessons[].scripture[].addressID` **string** - The API.Bible ID for this passage used to auto-fetch the scripture text fro, API.Bible.
- `sets[].lessons[].scripture[].text` **string** - The text of the Scripture passage.

## feedback
- `OS` **string** - Which OS the user is using. `android` or `ios`.
- `appVersion` **string** - Which app version the user is on.
- `contactEmail` **string** - The contact email for the language instance the user is using.
- `email` **string** - The email of the user.
- `isABug` **string** - Whether this is a report for a bug.
- `language` **string** - The language instance the user is using.
- `message` **string** - The user's message.
- `reproductionSteps` **string** - Steps to reproduce if this is a bug report.
- `timeSubmitted` **string** - The time the feedback was submitted.