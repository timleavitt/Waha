import {
  DELETE_LANGUAGE_DATA,
  SET_HAS_FETCHED_LANGUAGE_DATA,
  SET_HAS_INSTALLED_FIRST_LANGUAGE_INSTANCE,
  SET_HAS_ONBOARDED,
  SET_LANGUAGE_CORE_FILES_DOWNLOAD_PROGRESS,
  SET_TOTAL_LANGUAGE_CORE_FILES_TO_DOWNLOAD,
  STORE_LANGUAGE_DATA
} from '../actions/databaseActions'

export function database (
  state = {
    hasOnboarded: false,
    hasInstalledFirstLanguageInstance: false,
    languageCoreFilesDownloadProgress: 0,
    storedDownloads: []
  },
  action
) {
  switch (action.type) {
    case STORE_LANGUAGE_DATA:
      return { ...state, [action.languageInstanceID]: action.languageData }
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
