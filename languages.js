/**
 * This file contains all of the language families and languages in Waha. This is used to populate the LanguageInstanceInstall screen, get the i18n keys for translation, and get the font and RTL status of a language family or language.
 * @param {string} languages[].i18nName - This is the key that i18n will use to get the translation of this language family’s name in a different language.
 * @param {string} languages[].languageCode - This is language code for this language family. Must be the same as the code for this language used in i18n.
 * @param {string} languages[].font - This is the name of the font that this language family uses.
 * @param {boolean} languages[].isRTL - Whether this language family’s script is RTL or not.
 * @param {Object[]} languages[].data - This is an array of the language instances that are in this language family.
 * @param {string} languages[].data[].nativeName - This is the same as the displayName key in Firestore and will be how the language instance is displayed in-app.
 * @param {string} languages[].data[].wahaID - This is the language instance’s 2-letter ID. Must match up with the ID used in Firestore.
 * @param {string} languages[].data[].i18nName - This is the key that i18n will use to get the translation of this language’s name in a different language. For instance, if the user’s app is set to Arabic, the app will look for an Arabic translation of the “English” language instance in the ar.json translations object (which is the language family, not the language instance) using the i18nName property in the english language instance object.
 * @param {string} languages[].data[].logoSource - This is the Firebase URL for this language instance’s logo. This is used only to display the logo on the LanguageSelectScreen before any logos have been downloaded to the user’s device.
 */
export const languages = [
  {
    i18nName: 'english',
    languageCode: 'en',
    font: 'Roboto',
    isRTL: false,
    data: [
      {
        nativeName: 'English',
        wahaID: 'en',
        i18nName: 'english',
        logoSource:
          'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/en%2Fother%2Fheader-v1.png?alt=media'
      }
      // {
      //   nativeName: 'Test Language',
      //   wahaID: 'te',
      //   i18nName: 'english',
      //   logoSource:
      //     'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/en%2Fother%2Fheader-v1.png?alt=media'
      // },
      // {
      //   nativeName: 'Test Language 2',
      //   wahaID: 'tt',
      //   i18nName: 'english',
      //   logoSource:
      //     'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/en%2Fother%2Fheader-v1.png?alt=media'
      // }
    ]
  },
  {
    i18nName: 'arabic',
    languageCode: 'ar',
    font: 'NotoSansArabic',
    isRTL: true,
    data: [
      {
        nativeName: 'الخليج العربي',
        wahaID: 'ga',
        i18nName: 'gulfArabic',
        logoSource:
          'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/ga%2Fother%2Fheader-v1.png?alt=media'
      }
      // {
      //   nativeName: 'FusHa',
      //   wahaID: 'ar',
      //   i18nName: 'fusha',
      //   logoSource:
      //     'https://firebasestorage.googleapis.com/v0/b/waha-app-db.appspot.com/o/ar%2Fother%2Fheader-v1.png?alt=media'
      // }
    ]
  }
]
