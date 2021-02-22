export const SET_IS_INSTALLING_LANGUAGE_INSTANCE =
  'SET_IS_INSTALLING_LANGUAGE_INSTANCE'

/**
 * Sets whether we're currently installing a language instance or not.
 * @export
 * @param {boolean} isInstallingLanguageInstance - Whether we're currently installing a language instance or not.
 * @return {Object} - Object to send to the reducer.
 */
export function setIsInstallingLanguageInstance (isInstallingLanguageInstance) {
  return {
    type: SET_IS_INSTALLING_LANGUAGE_INSTANCE,
    isInstallingLanguageInstance
  }
}
