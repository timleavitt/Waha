import {
  DELETE_LANGUAGE_DATA,
  SET_HAS_FETCHED_LANGUAGE_DATA,
  SET_HAS_INSTALLED_FIRST_LANGUAGE_INSTANCE,
  SET_HAS_ONBOARDED,
  SET_LANGUAGE_CORE_FILES_DOWNLOAD_PROGRESS,
  SET_TOTAL_LANGUAGE_CORE_FILES_TO_DOWNLOAD,
  STORE_LANGUAGE_DATA,
  STORE_LANGUAGE_SETS
} from '../actions/databaseActions'

/**
 * The database redux reducer stores all the information for all language instances installed on this device. This includes app translations, lesson translations, language instance properties, etc. All of this is fetched from firebase and stored in redux.
 * @param {Object} action Parameters passed from databaseActions.js functions.
 * @param {Object[]} database (state) Stores all of the information for all language instances installed on this device.
 * @param {boolean} database.hasOnboarded - Whether the user has completed the initial onboarding slides that appear after they select their language instance.
 * @param {boolean} database.hasFetchedLanguageData - Whether the app has completed the initial firebase fetch or not. This gets set to true after a successful return of data from firebase. It gets reset every time we install a new language instance. We store this so that we can make the 'cancel' button appear on the loading screen whenever we finish fetching. If the user can cancel before the fetching has completed, there's no way to cancel the downloads that happen automatically after the fetch happens.
 * @param {boolean} database.hasInstalledFirstLanguageInstance - Whether the user has installed their first language instance. We use this to decide what to render in Root.js in /navigation/.
 * @param {boolean} database.languageCoreFilesDownloadProgress - The progress of the downloads for the language core files. Gets incremented by 1 whenever a file finishes.
 * @param {boolean} database.totalLanguageCoreFilesToDownload - The total number of language core files to download for tracking progress.
 * @param {string} database[languageID].displayName - The name of the language instance as it will appear in the app.
 * @param {string} database[languageID].bibleID - The Bible.API ID of the bible translations this language instance uses.
 * @param {boolean} database[languageID].isRTL - Whether this language instance is right-to-left or not.
 * @param {string} database[languageID].primaryColor - The accent color for this language instance.
 * @param {string[]} database[languageID].files - An array of strings that are the files that must be downloaded to the device when this language instance is installed.
 * @param {Object} database[languageID].questions - An object which contains every question set for this language instance. Keys are the names of the question sets.
 * @param {string[]} database[languageID].questions[questionSetName] - An array of strings where each element is a question in the question set.
 * @param {Object} database[languageID].translations - An object that holds are the app translations, such as labels and alerts. Separated by screen and then again by whether the text is for a popup or not (alerts, modals, etc.).
 * @param {Object[]} database[languageID].sets - Array of objects for all of the story sets for this language instance.
 * @param {string} database[languageID].sets[].languageID - The ID of the language instance that this story set is a part of.
 * @param {string} database[languageID].sets[].title - The translated title of this story set.
 * @param {string} database[languageID].sets[].subtitle - The translated subtitle of this story set.
 * @param {string} database[languageID].sets[].iconName - The name of the icon for this story set. See assets/fonts/icons.js for available icons.
 * @param {Object[]} database[languageID].sets[].lessons - An array or objects for the lessons in a story set.
 * @param {string} database[languageID].sets[].lessons[].id -
 * @param {string} database[languageID].sets[].lessons[].title -
 * @param {boolean} database[languageID].sets[].lessons[].hasAudio -
 * @param {boolean} database[languageID].sets[].lessons[].hasVideo -
 * @param {Object[]} database[languageID].sets[].lessons[].scripture -
 */
export function database (
  state = {
    hasOnboarded: false,
    hasInstalledFirstLanguageInstance: false,
    languageCoreFilesDownloadProgress: 0
  },
  action
) {
  switch (action.type) {
    case STORE_LANGUAGE_DATA:
      return {
        ...state,
        [action.languageInstanceID]: {
          ...state[action.languageInstanceID],
          // appVersion: action.languageData[appVersion],
          displayName: action.languageData.displayName,
          bibleID: action.languageData.bibleID,
          isRTL: action.languageData.isRTL,
          primaryColor: action.languageData.primaryColor,
          files: action.languageData.files,
          questions: action.languageData.questions,
          translations: action.languageData.translations
        }
      }
    case STORE_LANGUAGE_SETS:
      return {
        ...state,
        [action.languageInstanceID]: {
          ...state[action.languageInstanceID],
          sets: action.languageSets
        }
      }
    case SET_HAS_ONBOARDED:
      return { ...state, hasOnboarded: action.hasOnboarded }
    case SET_HAS_INSTALLED_FIRST_LANGUAGE_INSTANCE:
      return {
        ...state,
        hasInstalledFirstLanguageInstance:
          action.hasInstalledFirstLanguageInstance
      }
    case SET_LANGUAGE_CORE_FILES_DOWNLOAD_PROGRESS:
      return {
        ...state,
        languageCoreFilesDownloadProgress:
          action.languageCoreFilesDownloadProgress
      }
    case SET_TOTAL_LANGUAGE_CORE_FILES_TO_DOWNLOAD:
      return {
        ...state,
        totalLanguageCoreFilesToDownload:
          action.totalLanguageCoreFilesToDownload
      }
    case DELETE_LANGUAGE_DATA:
      const languageToDelete = action.languageInstanceID
      const { [languageToDelete]: value, ...newObject } = state
      return newObject
    case SET_HAS_FETCHED_LANGUAGE_DATA:
      return { ...state, hasFetchedLanguageData: action.hasFetchedLanguageData }
    default:
      return state
  }
}
