export const SET_IS_INSTALLING_LANGUAGE_INSTANCE =
  'SET_IS_INSTALLING_LANGUAGE_INSTANCE'

export function setIsInstallingLanguageInstance (isInstallingLanguageInstance) {
  return {
    type: SET_IS_INSTALLING_LANGUAGE_INSTANCE,
    isInstallingLanguageInstance
  }
}
