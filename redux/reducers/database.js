import {
  ADD_LANGUAGE_CORE_FILE_TO_UPDATE,
  CLEAR_LANGUAGE_CORE_FILES_TO_UPDATE,
  DELETE_LANGUAGE_DATA,
  INCREMENT_GLOBAL_GROUP_COUNTER,
  SET_HAS_FETCHED_LANGUAGE_DATA,
  SET_HAS_INSTALLED_FIRST_LANGUAGE_INSTANCE,
  SET_HAS_ONBOARDED,
  SET_LANGUAGE_CORE_FILES_DOWNLOAD_PROGRESS,
  SET_TOTAL_LANGUAGE_CORE_FILES_TO_DOWNLOAD,
  STORE_ACTING_LANGUAGE_ID,
  STORE_LANGUAGE_CORE_FILE_CREATED_TIME,
  STORE_LANGUAGE_DATA,
  STORE_LANGUAGE_SETS
} from '../actions/databaseActions'

/**
 * The database redux reducer stores all the information for all language instances installed on this device. This includes app translations, lesson translations, language instance properties, etc. All of this is fetched from Firestore and stored in redux. It also stores the user's progress through setting up the app, such as onboarding, installing their first language instance, etc. This state is persisted across app restarts.
 * @param {Object} action - Parameters passed from databaseActions.js functions.
 * @param {Object[]} database - (state) Stores all of the information for all language instances installed on this device.
 * @param {number} database.globalGroupCounter - A simple counter that goes up by 1 with every created group. This is used to give each created group a unique ID.
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
 * @param {string} database[languageID].sets[].lessons[].id - The ID for this lesson.
 * @param {string} database[languageID].sets[].lessons[].title - The title of this lesson.
 * @param {boolean} database[languageID].sets[].lessons[].hasAudio - Whether this lesson has an mp3 audio file for its Story chapter in Firebase.
 * @param {boolean} database[languageID].sets[].lessons[].hasVideo - Whether this lesson has an mp4 video file for its Story chapter in Firebase.
 * @param {Object[]} database[languageID].sets[].lessons[].scripture - An array of objects of the different passages of Scripture that are a part of this lesson.
 * @param {string} database[languageID].sets[].lessons[].scripture[].header - The header for this scripture passage, which is just the address in the vernacular. This will appear above the passage text in the scripture pane of the Play Screen.
 * @param {string} database[languageID].sets[].lessons[].scripture[].addressID - The specific API.Bible ID for this passage of scripture. Used to give each scripture passage a unique ID but also to automatically fetch passages of scripture from API.Bible.
 * @param {string} database[languageID].sets[].lessons[].scripture[].text - The actual text for this scripture passage.
 * @param {string} database[languageID].sets[].lessons[].fellowshipType - The variety of question set for this lesson's Fellowship chapter. Must be present in database[languageID].files as well.
 * @param {string} database[languageID].sets[].lessons[].applicationType - The variety of question set for this lesson's Application chapter. Must be present in database[languageID].files as well.
 * @param {string} database[languageID].sets[].lessons[].videoShareLink - The  link for the video that goes with this lesson. Only necessary if this lesson has a video.
 * @param {string} database[languageID].sets[].lessons[].text - The text for the chapter of the book that this lesson is. Only necesssary if this lesson is a part of an audio book.
 */
export function database (
  state = {
    globalGroupCounter: 0,
    hasOnboarded: false,
    hasFetchedLanguageData: false,
    hasInstalledFirstLanguageInstance: false,
    languageCoreFilesDownloadProgress: 0,
    languageCoreFilesToUpdate: [],
    actingLanguageID: null,
    globalGroupCounter: 0
  },
  params
) {
  switch (params.type) {
    case INCREMENT_GLOBAL_GROUP_COUNTER:
      return {
        ...state,
        globalGroupCounter: state.globalGroupCounter + 1
      }
    case STORE_LANGUAGE_DATA:
      return {
        ...state,
        [params.languageInstanceID]: {
          ...state[params.languageInstanceID],
          // appVersion: params.languageData[appVersion],
          displayName: params.languageData.displayName,
          bibleID: params.languageData.bibleID,
          isRTL: params.languageData.isRTL,
          primaryColor: params.languageData.primaryColor,
          files: params.languageData.files,
          questions: params.languageData.questions,
          translations: params.languageData.translations,
          installTime: state[params.languageInstanceID].installTime
            ? state[params.languageInstanceID].installTime
            : Date.now()
        }
      }
    case STORE_LANGUAGE_SETS:
      return {
        ...state,
        [params.languageInstanceID]: {
          ...state[params.languageInstanceID],
          sets: params.languageSets
        }
      }
    case SET_HAS_ONBOARDED:
      return { ...state, hasOnboarded: params.hasOnboarded }
    case SET_HAS_INSTALLED_FIRST_LANGUAGE_INSTANCE:
      return {
        ...state,
        hasInstalledFirstLanguageInstance:
          params.hasInstalledFirstLanguageInstance
      }
    case SET_LANGUAGE_CORE_FILES_DOWNLOAD_PROGRESS:
      return {
        ...state,
        languageCoreFilesDownloadProgress:
          params.languageCoreFilesDownloadProgress
      }
    case SET_TOTAL_LANGUAGE_CORE_FILES_TO_DOWNLOAD:
      return {
        ...state,
        totalLanguageCoreFilesToDownload:
          params.totalLanguageCoreFilesToDownload
      }
    case DELETE_LANGUAGE_DATA:
      const languageToDelete = params.languageInstanceID
      const { [languageToDelete]: value, ...newObject } = state
      return newObject
    case STORE_LANGUAGE_CORE_FILE_CREATED_TIME:
      return {
        ...state,
        languageCoreFilesCreatedTimes: {
          ...state.languageCoreFilesCreatedTimes,
          [params.fileName]: params.timeCreated
        }
      }
    case ADD_LANGUAGE_CORE_FILE_TO_UPDATE:
      return {
        ...state,
        languageCoreFilesToUpdate: [
          ...state.languageCoreFilesToUpdate,
          params.fileName
        ]
      }
    case CLEAR_LANGUAGE_CORE_FILES_TO_UPDATE:
      return {
        ...state,
        languageCoreFilesToUpdate: []
      }
    case SET_HAS_FETCHED_LANGUAGE_DATA:
      return { ...state, hasFetchedLanguageData: params.hasFetchedLanguageData }
    case STORE_ACTING_LANGUAGE_ID:
      return {
        ...state,
        actingLanguageID: params.languageID
      }
    default:
      return state
  }
}
