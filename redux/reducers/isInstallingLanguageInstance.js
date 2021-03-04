import { SET_IS_INSTALLING_LANGUAGE_INSTANCE } from '../actions/isInstallingLanguageInstanceActions'

/**
 * This reducer simply stores whether the app is currently installing a language instance or not. This is stored in a separate reducer from database.js so that it isn't persisted.
 * @param {Object} action - Parameters passed from isInstallingLanguageInstanceActions.js functions.
 * @param {boolean} isInstallingLanguageInstance - (state) Whether the app is currently installing a language instance or not. Defaults to false.
 */
export function isInstallingLanguageInstance (state = false, params) {
  switch (params.type) {
    case SET_IS_INSTALLING_LANGUAGE_INSTANCE:
      return params.isInstallingLanguageInstance
    default:
      return state
  }
}
