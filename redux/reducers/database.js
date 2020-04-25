import { STORE_DATA, FETCH_ERROR, SET_IS_FETCHING, SET_FIRST_OPEN, SET_IS_READY_TO_START, DELETE_LANGUAGE } from '../actions/databaseActions'

export function database(state = { isFetching: true, isFirstOpen: true, readyToStart: false, scripts: {} }, action) {
   switch (action.type) {
      case STORE_DATA:
         return { ...state, [action.language]: action.data }
      case SET_IS_FETCHING:
         // true whenever we're getting data from firebase
         return { ...state, isFetching: action.isFetching }
      case SET_FIRST_OPEN:
         // used to determine if we need to go to onboarding
         return { ...state, isFirstOpen: action.isFirstOpen }
      case SET_IS_READY_TO_START:
         // used to determine if we've gone through onboarding and are finished fetching
         return { ...state, isReadyToStart: action.isReadyToStart }
      case DELETE_LANGUAGE:
         const languageToDelete = action.language
         const { [languageToDelete]: value, ...newObject } = state;
         return newObject
      default:
         return state
   }
}