import { STORE_DATA, SET_FETCH_ERROR, SET_IS_FETCHING, SET_FINISHED_ONBOARDING, SET_FINISHED_INITIAL_FETCH , DELETE_LANGUAGE, SET_CURRENT_FETCH_PROGRESS } from '../actions/databaseActions'

export function database(state = { haveFinishedOnboarding: false, haveFinishedInitialFetch: false, currentFetchProgress: 0 }, action) {
   switch (action.type) {
      case STORE_DATA:
         return { ...state, [action.language]: action.data }
      case SET_FINISHED_ONBOARDING:
         return { ...state, haveFinishedOnboarding: action.haveFinishedOnboarding }
      case SET_FINISHED_INITIAL_FETCH :
         return { ...state, haveFinishedInitialFetch: action.haveFinishedInitialFetch }
      case SET_CURRENT_FETCH_PROGRESS:
         return { ...state, currentFetchProgress: action.progress }
      case DELETE_LANGUAGE:
         const languageToDelete = action.language
         const { [languageToDelete]: value, ...newObject } = state;
         return newObject
      default:
         return state
   }
}

export function fetchingStatus(state = { isFetching: false, fetchError: false, errorLanguage: null }, action) {
   switch (action.type) {
      case SET_IS_FETCHING:
         // true whenever we're getting data from firebase
         return { ...state, isFetching: action.isFetching }
      case SET_FETCH_ERROR:
         return { ...state, fetchError: action.status, errorLanguage: action.language }
      default:
         return state
   }
}