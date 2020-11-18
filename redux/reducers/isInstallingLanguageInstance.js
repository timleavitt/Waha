import { SET_IS_INSTALLING_LANGUAGE_INSTANCE } from '../actions/isInstallingLanguageInstanceActions'

export function isInstallingLanguageInstance (state = false, action) {
  switch (action.type) {
    case SET_IS_INSTALLING_LANGUAGE_INSTANCE:
      // true whenever we're getting data from firebase
      return action.isInstallingLanguageInstance
    default:
      return state
  }
}
