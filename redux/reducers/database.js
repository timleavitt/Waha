import {
  DELETE_LANGUAGE,
  SET_CURRENT_FETCH_PROGRESS,
  SET_FINISHED_INITIAL_FETCH,
  SET_FINISHED_ONBOARDING,
  SET_TOTAL_TO_DOWNLOAD,
  STORE_DATA
} from '../actions/databaseActions'

export function database (
  state = {
    haveFinishedOnboarding: false,
    haveFinishedInitialFetch: false,
    currentFetchProgress: 0,
    fetchSuccess: null,
    storedDownloads: []
  },
  action
) {
  switch (action.type) {
    case STORE_DATA:
      return { ...state, [action.language]: action.data }
    case SET_FINISHED_ONBOARDING:
      return { ...state, haveFinishedOnboarding: action.haveFinishedOnboarding }
    case SET_FINISHED_INITIAL_FETCH:
      return {
        ...state,
        haveFinishedInitialFetch: action.haveFinishedInitialFetch
      }
    case SET_CURRENT_FETCH_PROGRESS:
      return { ...state, currentFetchProgress: action.progress }
    case SET_TOTAL_TO_DOWNLOAD:
      return { ...state, totalToDownload: action.total }
    case DELETE_LANGUAGE:
      const languageToDelete = action.language
      const { [languageToDelete]: value, ...newObject } = state
      return newObject

    default:
      return state
  }
}
