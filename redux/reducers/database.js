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

export function database (
  state = {
    hasOnboarded: false,
    hasInstalledFirstLanguageInstance: false,
    languageCoreFilesDownloadProgress: 0,
    storedDownloads: [],
    languageCoreFilesToUpdate: [],
    actingLanguageID: null,
    globalGroupCounter: 0
  },
  action
) {
  switch (action.type) {
    case INCREMENT_GLOBAL_GROUP_COUNTER:
      return {
        ...state,
        globalGroupCounter: state.globalGroupCounter + 1
      }
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
    case STORE_LANGUAGE_CORE_FILE_CREATED_TIME:
      return {
        ...state,
        languageCoreFilesCreatedTimes: {
          ...state.languageCoreFilesCreatedTimes,
          [action.fileName]: action.timeCreated
        }
      }
    case ADD_LANGUAGE_CORE_FILE_TO_UPDATE:
      return {
        ...state,
        languageCoreFilesToUpdate: [
          ...state.languageCoreFilesToUpdate,
          action.fileName
        ]
      }
    case CLEAR_LANGUAGE_CORE_FILES_TO_UPDATE:
      return {
        ...state,
        languageCoreFilesToUpdate: []
      }
    case SET_HAS_FETCHED_LANGUAGE_DATA:
      return { ...state, hasFetchedLanguageData: action.hasFetchedLanguageData }
    case STORE_ACTING_LANGUAGE_ID:
      return {
        ...state,
        actingLanguageID: action.languageID
      }
    default:
      return state
  }
}
